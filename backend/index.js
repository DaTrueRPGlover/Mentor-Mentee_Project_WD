const mysql = require('mysql2/promise')
require('dotenv').config();
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Adjust the limit based on your needs
  queueLimit: 0
});
const express = require('express');
// const bcrypt = require('bcrypt');
const cors = require('cors');
module.exports = pool;
const app = express();

app.use(express.json());
app.use(cors());

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    const sql = 'SELECT * FROM usersInfo WHERE email = ?';
    const [rows] = await pool.execute(sql, [email]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const user = rows[0];

    if (password !== user.password) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    res.status(200).json({
      message: 'Login successful!',
      userId: user.id,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});