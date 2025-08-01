import express from 'express';
import { getMentorNames, getMenteeNames } from '../database_queries/AdminQueries.js'; // Adjust path if necessary

const router = express.Router();

// Fetch mentor names
router.get('/mentors', async (req, res) => {
    try {
        const mentors = await getMentorNames();
        console.log('Fetched mentors:', mentors); // Log the mentors
        res.json(mentors); // Send the fetched mentor names to the client
    } catch (error) {
        console.error('Error fetching mentor names:', error);
        res.status(500).json({ error: 'Failed to fetch mentor names' });
    }
});

router.get('/mentees', async (req, res) => {
    try {
        const mentees = await getMenteeNames();
        console.log('Fetched mentees:', mentees); // Log the mentees
        res.json(mentees); // Send the fetched mentee names to the client
    } catch (error) {
        console.error('Error fetching mentee names:', error);
        res.status(500).json({ error: 'Failed to fetch mentee names' });
    }
});

export default router;
