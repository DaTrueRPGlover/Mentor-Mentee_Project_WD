import express from 'express';
import { createHomework, fetchHomeworkByMenteeKey, fetchHomeworkByMentorKey } from '../database_queries/HomeworkQueries.js';

const router = express.Router();

// Route to assign homework
router.post('/assign-homework', async (req, res) => {
    const { menteeKey, mentorKey, title, description, assignedDate, dueDate } = req.body;

    try {
        const homeworkId = await createHomework(menteeKey, mentorKey, title, description, assignedDate, dueDate);
        res.status(201).json({ message: 'Homework assigned successfully', homeworkId });
    } catch (error) {
        console.error('Error in /assign-homework route:', error);
        res.status(500).json({ message: 'Failed to assign homework', error: error.message });
    }
});

// Route to fetch homework by menteeKey
router.get('/mentee/:menteeKey', async (req, res) => {
    const { menteeKey } = req.params;

    try {
        const homework = await fetchHomeworkByMenteeKey(menteeKey);
        res.status(200).json(homework);
    } catch (error) {
        console.error('Error in /homework/mentee route:', error);
        res.status(500).json({ message: 'Failed to fetch homework by menteeKey', error: error.message });
    }
});

// Route to fetch homework by mentorKey
router.get('/mentor/:mentorKey', async (req, res) => {
    const { mentorKey } = req.params;

    try {
        const homework = await fetchHomeworkByMentorKey(mentorKey);
        res.status(200).json(homework);
    } catch (error) {
        console.error('Error in /homework/mentor route:', error);
        res.status(500).json({ message: 'Failed to fetch homework by mentorKey', error: error.message });
    }
});

export default router;
