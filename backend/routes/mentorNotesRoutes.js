import express from 'express';
import { 
    getMentorNotesByMeetingKey, 
    insertMentorNotes, 
    updateMentorNotes,
    getMentorNotesByKeys 
} from '../database_queries/MentorNotesQueries.js'; // Adjust path as needed

const router = express.Router();

// Route to get mentor notes by meeting key
router.get('/mentornotes/:meetingkey', async (req, res) => {
    const { meetingkey } = req.params;
    try {
      const notes = await getMentorNotesByMeetingKey(meetingkey);
      if (notes) {
        res.json(notes);
      } else {
        res.status(404).json({ message: 'No mentor notes found for this meeting key.' });
      }
    } catch (error) {
      console.error('Error fetching mentor notes:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
  router.post('/mentornotes', async (req, res) => {
    const { meetingkey, mentorkey, datetime, skipped, finishedHomework, attitudeTowardsLearning, additionalComments } = req.body;
  
    try {
      const result = await insertMentorNotes(
        meetingkey, 
        mentorkey, 
        datetime, 
        skipped, 
        finishedHomework, 
        attitudeTowardsLearning, 
        additionalComments
      );
      res.status(201).json({ message: 'Mentor notes inserted successfully.', meetingkey: result });
    } catch (error) {
      console.error('Error inserting mentor notes:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/mentornotes/:meetingkey/:mentorkey', async (req, res) => {
    const { meetingkey, mentorkey } = req.params;
    try {
        const notes = await getMentorNotesByKeys(meetingkey, mentorkey);
        if (notes) {
            res.json(notes);
        } else {
            res.status(404).json({ message: 'No notes found for this meeting and mentor key.' });
        }
    } catch (error) {
        console.error('Error fetching mentor notes:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Route to update existing mentor notes
router.put('/mentornotes/:meetingkey/:mentorkey', async (req, res) => {
    const { meetingkey, mentorkey } = req.params;
    const { datetime, skipped, finishedHomework, attitudeTowardsLearning, additionalComments } = req.body;

    try {
        const result = await updateMentorNotes(
            meetingkey, 
            mentorkey, 
            datetime, 
            skipped, 
            finishedHomework, 
            attitudeTowardsLearning, 
            additionalComments
        );

        if (result) {
            res.json({ message: 'Mentor notes updated successfully.' });
        } else {
            res.status(404).json({ message: 'Mentor note not found for the provided meeting key and mentor key.' });
        }
    } catch (error) {
        console.error('Error updating mentor notes:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

export default router;
