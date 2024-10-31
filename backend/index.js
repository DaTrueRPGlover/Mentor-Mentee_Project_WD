// index.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const app = express();
const initializeDb = require('./db');
const UserModel = require('./models/userModel');
let db;
let userModel;

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Initialize the database connection and add a test user
initializeDb()
  .then(async (connection) => {
    db = connection;
    userModel = new UserModel(db); // Initialize UserModel

    // Add a test user
    await addTestUser();

    // Start the server
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });

// Function to add a test user
async function addTestUser() {
  try {
    const name = 'Test Mentor';
    const email = 'testmentor@example.com';
    const password = 'password123';
    const role = 'mentor'; // or 'mentee' or 'admin'
    const department = 'Computer Science';
    const username = 'testmentor';

    // Check if the email already exists using UserModel
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      console.log('Test user already exists.');
      return;
    }

    // Create user using UserModel
    const userData = { name, email, password, role, department, username };
    const userId = await userModel.createUser(userData);

    // Map department to departmentkey
    const departmentkey = await getDepartmentKey(department);

    // Insert into the corresponding table based on role
    await insertUserRoleData(userId, userData, departmentkey);

    console.log('Test user created successfully with ID:', userId);
  } catch (error) {
    console.error('Error during test user creation:', error);
  }
}

// Function to get department key from department name
async function getDepartmentKey(departmentName) {
  // Assuming you have a 'department' table that maps department names to keys
  const sql = 'SELECT departmentkey FROM department WHERE name = ?';
  const [rows] = await db.execute(sql, [departmentName]);
  if (rows.length > 0) {
    return rows[0].departmentkey;
  } else {
    // If department not found, insert it and return the new key
    const insertSql = 'INSERT INTO department (name) VALUES (?)';
    const [result] = await db.execute(insertSql, [departmentName]);
    return result.insertId;
  }
}

// Function to insert user role data
async function insertUserRoleData(userId, userData, departmentkey) {
  const { name, email, role, username } = userData;
  if (role.toLowerCase() === 'mentor') {
    const mentorkey = userId; // Use user ID as mentor key
    // const menteekey = null; // Initially, mentor has no mentee assigned
    const sql = `INSERT INTO mentor (mentorkey, menteekey, name, departmentkey, email, username)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [mentorkey, menteekey, name, departmentkey, email, username];
    await db.execute(sql, params);
  } else if (role.toLowerCase() === 'mentee') {
    const menteekey = userId; // Use user ID as mentee key
    const assignedMentorKey = await assignMentor(menteekey); // Function to assign mentor
    const sql = `INSERT INTO mentee (menteekey, mentorkey, name, departmentkey, email, username)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [menteekey, assignedMentorKey, name, departmentkey, email, username];
    await db.execute(sql, params);

    // Update mentor's menteekey
    const updateMentorSql = 'UPDATE mentor SET menteekey = ? WHERE mentorkey = ?';
    await db.execute(updateMentorSql, [menteekey, assignedMentorKey]);
  } else if (role.toLowerCase() === 'admin') {
    const adminkey = userId; // Use user ID as admin key
    const sql = `INSERT INTO admin (adminkey, name, departmentkey, email, username)
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [adminkey, name, departmentkey, email, username];
    await db.execute(sql, params);
  }
}

// Function to assign a mentor to a mentee (simple implementation)
async function assignMentor(menteekey) {
  // For simplicity, assign the first available mentor who doesn't have a mentee
  const sql = 'SELECT mentorkey FROM mentor WHERE menteekey IS NULL LIMIT 1';
  const [rows] = await db.execute(sql);
  if (rows.length > 0) {
    const assignedMentorKey = rows[0].mentorkey;

    // The mentor's menteekey will be updated in insertUserRoleData
    return assignedMentorKey;
  } else {
    throw new Error('No mentors available to assign.');
  }
}

// Route to create a new user
app.post(
  '/users',
  [
    check('name').not().isEmpty().withMessage('Name is required.'),
    check('email').isEmail().withMessage('Invalid email address.'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.'),
    check('role').not().isEmpty().withMessage('Role is required.'),
    check('department').not().isEmpty().withMessage('Department is required.'),
    check('username').not().isEmpty().withMessage('Username is required.'),
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let { name, email, password, role, department, username } = req.body;

      // Normalize the role to lowercase
      role = role.toLowerCase();

      // Check if the email already exists using UserModel
      const existingUser = await userModel.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use.' });
      }

      // Create the new user using UserModel
      const userData = { name, email, password, role, department, username };
      const userId = await userModel.createUser(userData);

      // Map department to departmentkey
      const departmentkey = await getDepartmentKey(department);

      // Insert into the corresponding table based on role
      await insertUserRoleData(userId, userData, departmentkey);

      res.status(201).json({ message: 'User created successfully.', userId });
    } catch (error) {
      console.error('Error during user creation:', error);
      res.status(500).json({ message: 'An error occurred while creating the user.' });
    }
  }
);

// Route to handle login
app.post(
  '/login',
  [
    check('email').isEmail().withMessage('Invalid email address.'),
    check('password').not().isEmpty().withMessage('Password is required.'),
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Get the user from the database using UserModel
      const user = await userModel.getUserByEmail(email);
      console.log('Retrieved user:', user);

      if (!user) {
        console.log('Invalid credentials');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare the entered password with the stored hash
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        console.log('Login successful');

        // Debugging statements
        console.log('User ID:', user.iduserInfo);
        console.log('User Role:', user.role);

        let mentorkey = null;
        let menteekey = null;
        let menteeList = [];

        const userRole = user.role.toLowerCase(); // Normalize the role

        if (userRole === 'mentee') {
          // Get mentorkey from mentee table
          const sql = 'SELECT mentorkey FROM mentee WHERE menteekey = ?';
          if (!user.iduserInfo) {
            console.error('User ID is undefined');
            return res.status(500).json({ message: 'User ID is undefined' });
          }
          const [rows] = await db.execute(sql, [user.iduserInfo]);
          if (rows.length > 0) {
            mentorkey = rows[0].mentorkey;
            menteekey = user.iduserInfo;
          } else {
            console.error('Mentee record not found');
            return res.status(500).json({ message: 'Mentee record not found' });
          }
        } else if (userRole === 'mentor') {
          // Get menteekey from mentor table
          const sql = 'SELECT menteekey FROM mentor WHERE mentorkey = ?';
          if (!user.iduserInfo) {
            console.error('User ID is undefined');
            return res.status(500).json({ message: 'User ID is undefined' });
          }
          const [rows] = await db.execute(sql, [user.iduserInfo]);
          if (rows.length > 0) {
            menteekey = rows[0].menteekey;
            mentorkey = user.iduserInfo;
          } else {
            console.error('Mentor record not found');
            return res.status(500).json({ message: 'Mentor record not found' });
          }
          // You can also get mentee details if needed
          const menteeSql = 'SELECT name FROM mentee WHERE menteekey = ?';
          const [menteeRows] = await db.execute(menteeSql, [menteekey]);
          menteeList = menteeRows;
        } else if (userRole === 'admin') {
          // Handle admin login if needed
          console.log('Admin logged in');
        } else {
          console.error('Unknown user role:', user.role);
          return res.status(400).json({ message: 'Unknown user role' });
        }

        return res.status(200).json({
          message: 'Login successful',
          role: user.role,
          name: user.name,
          userId: user.iduserInfo, // Return the user ID
          mentorkey: mentorkey,
          menteekey: menteekey,
          menteeList: menteeList,
        });
      } else {
        console.log('Invalid credentials');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'An error occurred during login' });
    }
  }
);

// Route to store a new message
app.post('/messages', async (req, res) => {
  console.log('Received message:', req.body);
  let {
    isMentee,
    isMentor,
    menteekey,
    mentorkey,
    menteetext,
    mentortext,
  } = req.body;

  // Ensure undefined values are set to null
  if (typeof menteetext === 'undefined') menteetext = null;
  if (typeof mentortext === 'undefined') mentortext = null;

  const sql = `INSERT INTO conversationTable (isMentee, isMentor, menteekey, mentorkey, menteetext, mentortext)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    isMentee,
    isMentor,
    menteekey,
    mentorkey,
    menteetext,
    mentortext,
  ];

  try {
    await db.execute(sql, params);
    res.status(201).json({ message: 'Message stored successfully' });
  } catch (error) {
    console.error('Error storing message:', error);
    res.status(500).json({ message: 'An error occurred while storing the message' });
  }
});

// Route to retrieve messages
app.get('/messages', async (req, res) => {
  const { menteekey, mentorkey } = req.query;

  if (!menteekey || !mentorkey) {
    return res.status(400).json({ message: 'menteekey and mentorkey are required' });
  }

  const sql = 'SELECT * FROM conversationTable WHERE menteekey = ? AND mentorkey = ? ORDER BY date ASC';
  const params = [menteekey, mentorkey];

  try {
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'An error occurred while fetching messages' });
  }
});
