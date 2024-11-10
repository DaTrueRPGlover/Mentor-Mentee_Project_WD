import express from 'express';
import { getMenteeNames } from '../database_queries/AdminQueries.js';

const router = express.Router();

// Fetch mentee names
router.get('/', async (req, res) => {
    try {
        const mentees = await getMenteeNames();
        res.json(mentees);
    } catch (error) {
        console.error('Error fetching mentee names:', error);
        res.status(500).json({ error: 'Failed to fetch mentee names' });
    }
});

export default router;
