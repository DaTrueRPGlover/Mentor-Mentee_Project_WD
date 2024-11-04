import express from 'express';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../database_queries/userQueries.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    console.log("login here")
  const { email, password } = req.body;
  try {
    const rows = await getUserByEmail(email);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const mentorkey = user.role.toLowerCase() === 'mentor' ? user.userid : null;
    const menteekey = user.role.toLowerCase() === 'mentee' ? user.userid : null;

    res.json({
      userid: user.userid,
      name: user.name,
      role: user.role,
      department: user.department,
      mentorkey: mentorkey,
      menteekey: menteekey,
      menteeList: [],
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
