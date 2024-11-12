import express from 'express';
import bcrypt from 'bcryptjs';
import { getUserByEmail, updateUserPassword } from '../database_queries/userQueries.js';
const router = express.Router();

router.post('/login', async (req, res) => {
    console.log("login here");
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

        // Log user details (role and ID)
        console.log(`User logged in: ID = ${user.userid}, Role = ${user.role}`);

        const mentorkey = user.role.toLowerCase() === 'mentor' ? user.userid : null;
        const menteekey = user.role.toLowerCase() === 'mentee' ? user.userid : null;
        const adminkey = user.role.toLowerCase() === 'admin' ? user.userid : null;

        res.json({
            userid: user.userid,
            name: user.name,
            role: user.role,
            department: user.department,
            mentorkey: mentorkey,
            menteekey: menteekey,
            adminkey: adminkey,
            menteeList: [],
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update password route
router.put('/update-password', async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    // Validate input fields
    if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({ message: 'User ID, current password, and new password are required' });
    }

    try {
        // Call the updateUserPassword function to handle password update
        const result = await updateUserPassword(userId, currentPassword, newPassword);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or password could not be updated' });
        }

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        if (error.message === 'Current password is incorrect') {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
        
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
