import express from 'express';
import { getMentorNames } from '../database_queries/AdminQueries.js';

const router = express.Router();

// Fetch mentor names
router.get('/', async (req, res) => {
    try {
        const mentors = await getMentorNames();
        res.json(mentors);
    } catch (error) {
        console.error('Error fetching mentor names:', error);
        res.status(500).json({ error: 'Failed to fetch mentor names' });
    }
});

export default router;
