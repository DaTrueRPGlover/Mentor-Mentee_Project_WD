import express from 'express';
import {
  getMeetingsForUser,
  getMenteesForMentor,
  checkMeetingConflict,
  createMeeting,
  getMeetingsByMenteeKey
} from '../database_queries/MeetingQueries.js';

const router = express.Router();


//route to get all the meetings
router.get('/meetings', async (req, res) => {
  const userId = req.query.userId;
  try {
    const rows = await getMeetingsForUser(userId);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//route to get all mentees for said mentor
router.get('/mentees', async (req, res) => {
  const mentorkey = req.query.mentorkey;
  try {
    const rows = await getMenteesForMentor(mentorkey);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching mentees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//route to create meeting
router.post('/create-meeting', async (req, res) => {
  const { mentorkey, menteekey, datetime, zoom_link, zoom_password } = req.body;
  try {
    const existingMeetings = await checkMeetingConflict(mentorkey, datetime);

    if (existingMeetings.length > 0) {
      return res.status(409).json({ message: 'Meeting time conflict detected' });
    }

    await createMeeting(mentorkey, menteekey, datetime, zoom_link, zoom_password);
    res.status(201).json({ message: 'Meeting scheduled successfully' });
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/mentees/:menteekey', async (req, res) => {
  const { menteekey } = req.params;
  try {
      const meetings = await getMeetingsByMenteeKey(menteekey);
      if (meetings.length > 0) {
          res.json(meetings);
      } else {
          res.status(404).json({ message: 'No meetings found for this mentee.' });
      }
  } catch (error) {
      console.error('Error fetching meetings:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
