import express from 'express';
import { createAccount, updateAccount, getAdminNameByKey, getAdminEmailByKey, createMentorMenteeRelationship } from 
'../database_queries/AdminQueries.js';

const router = express.Router();

// Route to create a new account
router.post('/createAccount', async (req, res) => {
    const { name, lastname, email, password, department, role } = req.body;
    try {
        const userId = await createAccount(name, lastname, email, password, department, role);
        res.status(201).json({
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

// Route to update an existing account
router.put('/updateAccount', async (req, res) => {
    const { userId, name, lastname, email, password, department, role } = req.body;
    try {
        const updatedUserId = await updateAccount(userId, { firstName: name, lastName: lastname, email, password, department, role });
        
        if (updatedUserId) {
            res.status(200).json({
                userId: updatedUserId,
                name,
                lastname,
                email,
                department,
                role
            });
        } else {
            res.status(404).json({ message: 'Account not found or no changes made' });
        }
    } catch (error) {
        console.error('Failed to update account:', error);
        res.status(500).json({ message: 'Failed to update account' });
    }
});

export default router;
