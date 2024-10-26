const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware to parse incoming JSON requests and allow CORS
app.use(express.json());
app.use(cors());

// Mock user data (replace this with database calls later)
const users = [
  {  email: 'testmentor@wdc.com', name: 'Fernando', role: 'Mentor', department: 'GST', password: 'passmentor' },
  {  email: 'testmentee@wdc.com', name: 'Kyle', role: 'Mentee', department: 'GST', password: 'passmentee' },
  {  email: 'testadmin@wdc.com', name: 'Hikaru',role: 'Admin', department: 'GST', password: 'passadmin' },
  {email: 'test@wdc.com', name:'Shri', role: 'Tester', department: 'GST', password: 'passtester'}
]
//Handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if user existsxxxxxx
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // If user exists, send success message along with user role
    console.log("Login successful");
    return res.status(200).json({
      message: 'Login successful',
      role: user.role,        // Include the user's role
      name: user.name,
      // department: user.department, // Include additional info if needed
    });
  } else {
    // If user doesn't exist or wrong credentials
    console.log("Invalid credentials");
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
