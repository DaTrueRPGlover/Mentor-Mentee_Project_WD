import express from 'express';
import { createAccount, getAdminNameByKey, getAdminEmailByKey, createMentorMenteeRelationship } from 
'../database_queries/AdminQueries.js';

const router = express.Router();

// Route to create a new account
router.post('/createAccount', async (req, res) => {
    const { name, lastname, email, password, department, role } = req.body;
    try {
        const userId = await createAccount(name, lastname, email, password, department, role);
        res.status(201).json({
            id: userId, // or return other data as necessary
            name: name,
            lastname: lastname,
            email: email,
            department: department,
            role: role
        });        
    } catch (error) {
        console.error('Failed to create account:', error);
        res.status(500).json({ message: 'Failed to create account' });
    }
});

export default router;
