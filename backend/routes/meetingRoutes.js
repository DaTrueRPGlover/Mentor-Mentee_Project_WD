import express from 'express';
import pool from '../database.js';
import {
  getMeetingsForUser,
  getMeetingsByMentorKey,
  getMenteesForMentor,
  checkMeetingConflict,
  createMeeting,
  getMeetingsByMenteeKey,
  cancelMeeting, 
  rescheduleMeeting
} from '../database_queries/meetingQueries.js';
import { fetchHomeworkByMenteeKey } from '../database_queries/HomeworkQueries.js';

const router = express.Router();

router.get('/meetings', async (req, res) => {
  console.log(req.query);
  const userId = req.query.userId;
  console.log("meeting userId",userId);
  try {
    const rows = await getMeetingsForUser(userId);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/combinedEvents', async (req, res) => {
  const userId = req.query.userId;
  try {
    const meetings = await getMeetingsForUser(userId);
    const homework = await fetchHomeworkByMenteeKey(userId);
    res.json({ meetings, homework });
  } catch (error) {
    console.error('Error fetching combined events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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

router.post('/create-meeting', async (req, res) => {
  const { mentorkey, menteekey, datetime, zoom_link, zoom_password } = req.body;
  try {
    const existingMeetings = await checkMeetingConflict(mentorkey, menteekey, datetime, 60);

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

router.get('/mentors/:mentorkey', async (req, res) => {
  const { mentorkey } = req.params;
  try {
      const meetings = await getMeetingsByMentorKey(mentorkey);
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

router.post('/cancel', async (req, res) => {
  const { meetingKey } = req.body;
  try {
    await cancelMeeting(meetingKey);
    res.status(200).json({ message: 'Meeting canceled successfully' });
  } catch (error) {
    console.error('Error canceling meeting:', error);
    res.status(500).json({ message: 'Error canceling meeting' });
  }
});

// Route for rescheduling
router.post('/reschedule', async (req, res) => {
  const { meetingKey, newDateTime } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM meetings WHERE meetingkey = ?', [meetingKey]);
    const originalMeeting = rows[0];

    if (!originalMeeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const { mentorkey, menteekey } = originalMeeting;
    const duration = 60; // Duration in minutes

    const conflict = await checkMeetingConflict(mentorkey, menteekey, newDateTime, duration, meetingKey);

    if (conflict.length > 0) {
      return res.status(409).json({ message: 'Time conflict detected' });
    }

    await rescheduleMeeting(meetingKey, newDateTime);
    res.status(200).json({ message: 'Meeting rescheduled successfully' });
  } catch (error) {
    console.error('Error rescheduling meeting:', error);
    res.status(500).json({ message: 'Error rescheduling meeting' });
  }
});

export default router;
