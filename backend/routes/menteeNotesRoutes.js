// MenteeNotesRoutes.js
import express from 'express';
import { getMenteeNotesByMeetingKey, 
    insertMenteeNote, 
    getMenteeNotesByKeys, getMenteeMeetings
} from '../database_queries/MenteeNotesQueries.js';

const router = express.Router();

// Route to get mentee notes by meeting key
router.get('/menteenotes/:meetingkey', async (req, res) => {
    const { meetingkey } = req.params;
    try {
        const notes = await getMenteeNotesByMeetingKey(meetingkey);
        if (notes) {
            res.json(notes);
        } else {
            res.status(404).json({ message: 'No notes found for this meeting key.' });
        }
    } catch (error) {
        console.error('Error fetching mentee notes:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.get("/meetings/:menteekey", async (req, res) => {
    const { menteekey } = req.params;
    try {
        const meetings = await getMenteeMeetings(menteekey);
        res.json(meetings);
    } catch (error) {
        console.error("Error fetching meetings:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


// Route to insert a mentee note
router.post("/menteenotes", async (req, res) => {
    const {
        meetingkey = null,
        menteekey = null,
        datetime = new Date(),
        communication = null,
        influence = null,
        managingProjects = null,
        innovation = null,
        emotionalIntelligence = null,
        decisionMaking = null,
        additionalComments = null
    } = req.body;

    try {
        const result = await insertMenteeNote(
            meetingkey,
            menteekey,
            datetime,
            communication,
            influence,
            managingProjects,
            innovation,
            emotionalIntelligence,
            decisionMaking,
            additionalComments
        );
        res.status(201).json({ message: "Mentee note inserted successfully.", insertId: result.insertId });
    } catch (error) {
        console.error("Error inserting mentee note:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Route to get mentee notes by both meetingkey and menteekey
router.get('/menteenotes/:meetingkey/:menteekey', async (req, res) => {
    const { meetingkey, menteekey } = req.params;
    try {
        const notes = await getMenteeNotesByKeys(meetingkey, menteekey);
        if (notes) {
            res.json(notes);
        } else {
            res.status(404).json({ message: 'No notes found for this meeting and mentee key.' });
        }
    } catch (error) {
        console.error('Error fetching mentee notes:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// Route to update an existing mentee note
router.put('/menteenotes/:meetingkey/:menteekey', async (req, res) => {
    const { meetingkey, menteekey } = req.params;
    const { datetime, profileOfALeader, executiveCommunicationStyle, trustRespectVisibility, motivatingYourTeam, selfAdvocacyAndCareerGrowth, workLifeBalance, additionalComments } = req.body;

    try {
        const result = await updateMenteeNote(
            meetingkey,
            menteekey,
            datetime,
            profileOfALeader,
            executiveCommunicationStyle,
            trustRespectVisibility,
            motivatingYourTeam,
            selfAdvocacyAndCareerGrowth,
            workLifeBalance,
            additionalComments
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Mentee note not found or not updated.' });
        }

        res.status(200).json({ message: 'Mentee note updated successfully.' });
    } catch (error) {
        console.error('Error updating mentee note:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

export default router;
