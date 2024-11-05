import express from 'express';
import {
    getMentorNameByKey,
    getMenteeKeyByMentorKey,
    getMentorDepartmentKeyByKey,
    getMentorEmailByKey
} from '../database_queries/MentorQueries.js';
import {
    getMenteeKeyByMentorKey,
    getMenteeNameByKey,
    getMenteeEmailByKey,
    getMenteeDepartmentKeyByKey
} from '../database_queries/MenteeQueries';

const router = express.Router();

// Route to fetch mentor's name by mentorkey
router.get('/mentor/name/:mentorkey', async (req, res) => {
    const { mentorkey } = req.params;

    try {
        const mentorName = await getMentorNameByKey(mentorkey);
        res.status(200).json({ mentorName });
    } catch (error) {
        console.error('Error fetching mentor name:', error);
        res.status(500).json({ message: 'Failed to fetch mentor name', error: error.message });
    }
});

// Route to fetch mentee keys associated with a mentor
router.get('/mentor/mentees/:mentorkey', async (req, res) => {
    const { mentorkey } = req.params;

    try {
        const menteeKeys = await getMenteeKeyByMentorKey(mentorkey);
        res.status(200).json({ menteeKeys });
    } catch (error) {
        console.error('Error fetching mentee keys:', error);
        res.status(500).json({ message: 'Failed to fetch mentee keys', error: error.message });
    }
});

// Route to fetch mentor's department key by mentorkey
router.get('/mentor/department/:mentorkey', async (req, res) => {
    const { mentorkey } = req.params;

    try {
        const departmentKey = await getMentorDepartmentKeyByKey(mentorkey);
        res.status(200).json({ departmentKey });
    } catch (error) {
        console.error('Error fetching department key:', error);
        res.status(500).json({ message: 'Failed to fetch department key', error: error.message });
    }
});

// Route to fetch mentor's email by mentorkey
router.get('/mentor/email/:mentorkey', async (req, res) => {
    const { mentorkey } = req.params;

    try {
        const email = await getMentorEmailByKey(mentorkey);
        res.status(200).json({ email });
    } catch (error) {
        console.error('Error fetching mentor email:', error);
        res.status(500).json({ message: 'Failed to fetch mentor email', error: error.message });
    }
});

// Route to fetch mentees' names by mentor key
router.get('/:mentorkey/mentees', async (req, res) => {
    const { mentorkey } = req.params;

    try {
        // Fetch mentee keys for the given mentor
        const menteeKeys = await getMenteeKeyByMentorKey(mentorkey);

        // Fetch details for each mentee
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
