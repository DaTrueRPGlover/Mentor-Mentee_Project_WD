import express from 'express';
import { createMentorMenteeRelationship } from '../database_queries/AdminQueries.js';
import { getMentorMenteeRelationship } from '../database_queries/RelationshipQueries.js';

const router = express.Router();

/*router.get('/mentors-and-mentees', async (req, res) => {
    try {
        const users = await getAllMentorsAndMentees();
        res.json(users);
    } catch (error) {
        console.error('Error fetching mentors and mentees:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});*/

/*router.get('/get-relationship-mentee', async (req, res)) => {
    const { menteekey } = req.body;

    try {
        const relationship = await getMentorMenteeRelationship()
    }
}*/

router.post('/assign-mentor', async (req, res) => {
    const { mentorkey, menteekey } = req.body; // Get keys from request body

    try {
        const relationshipId = await createMentorMenteeRelationship(mentorkey, menteekey);
        res.status(201).json({ message: 'Mentor-Mentee relationship created', relationshipId });
    } catch (error) {
        console.error('Error assigning mentor:', error);
        res.status(500).json({ message: 'Failed to assign mentor' });
    }
});

export default router;