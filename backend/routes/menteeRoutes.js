import express from 'express';
import {
    // getMenteeKeysByMentorKey,
    getMenteeNameByKey,
    getMenteeEmailByKey,
    getMenteeDepartmentKeyByKey
} from '../database_queries/MenteeQueries.js';

const router = express.Router();

// Route to fetch mentees by mentor key
router.get('/mentor/:mentorkey/mentees', async (req, res) => {
    const { mentorkey } = req.params;

    try {
        const menteeKeys = await getMenteeKeysByMentorKey(mentorkey);

        const menteeDetails = await Promise.all(
            menteeKeys.map(async (menteekey) => {
                const menteeName = await getMenteeNameByKey(menteekey);
                const menteeEmail = await getMenteeEmailByKey(menteekey);
                const menteeDepartmentKey = await getMenteeDepartmentKeyByKey(menteekey);

                return { menteekey, menteeName, menteeEmail, menteeDepartmentKey };
            })
        );

        res.status(200).json({ mentees: menteeDetails });
    } catch (error) {
        console.error('Error fetching mentee details:', error);
        res.status(500).json({ message: 'Failed to fetch mentee details', error: error.message });
    }
});

export default router;
