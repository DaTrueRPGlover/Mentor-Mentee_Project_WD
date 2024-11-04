import express from 'express';
import pool from './database.js';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const app = express();
app.use(express.json());

// Configure CORS to allow requests from your frontend
app.use(
  cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL if different
    credentials: true,
  })
);

// Test the database connection on server startup
pool.getConnection();

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM userInfo WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    console.log(user.userid)
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Include mentorkey or menteekey based on role
    const mentorkey = user.role.toLowerCase() === 'mentor' ? user.userid : null;
    const menteekey = user.role.toLowerCase() === 'mentee' ? user.userid : null;

    // Send back user details
    res.json({
      userid: user.userid,
      name: user.name,
      role: user.role,
      department: user.department,
      mentorkey: mentorkey,
      menteekey: menteekey,
      menteeList: [], // Assuming you want to initialize this as empty; adjust if needed
    });
    console.log("userinfoahh", user.userid)
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Meetings route
app.get('/meetings', async (req, res) => {
  const userId = req.query.userId;

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        m.*, 
        u1.name AS mentor_name, 
        u2.name AS mentee_name,
        u1.userid AS mentorkey,
        u2.userid AS menteekey
      FROM 
        meetings m
      JOIN 
        userInfo u1 ON m.mentorkey = u1.userid
      JOIN 
        userInfo u2 ON m.menteekey = u2.userid
      WHERE 
        m.mentorkey = ? OR m.menteekey = ?
      `,
      [userId, userId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
