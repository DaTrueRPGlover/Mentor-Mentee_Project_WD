// MeetingRoutes.js
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
} from '../database_queries/MeetingQueries.js';
import { fetchHomeworkByMenteeKey } from '../database_queries/HomeworkQueries.js';
import { isTimeWithinMentorAvailability, isDateBlackout } from '../database_queries/MentorAvailabilityQueries.js'

const router = express.Router();

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
  const { mentorkey, menteekey, datetime, meeting_link, meeting_password } = req.body;
  try {
    const datetimeObj = new Date(datetime);

    // Check if date is a blackout date
    const isBlackout = await isDateBlackout(mentorkey, datetimeObj.toISOString().split('T')[0]);
    if (isBlackout) {
      return res.status(400).json({ message: 'Selected date is a blackout date for the mentor' });
    }

    // Check mentor availability
    const isAvailable = await isTimeWithinMentorAvailability(mentorkey, datetimeObj, 60);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Selected time is not within mentor availability' });
    }

    // Existing code to check for conflicts
    const existingMeetings = await checkMeetingConflict(mentorkey, menteekey, datetime, 60);

    if (existingMeetings.length > 0) {
      return res.status(409).json({ message: 'Meeting time conflict detected' });
    }

    await createMeeting(mentorkey, menteekey, datetime, meeting_link, meeting_password);
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
          res.status(404).json({ message: 'No meetings found for this mentor.' });
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

    // Check if date is a blackout date
    const newDateTimeObj = new Date(newDateTime);
    const isBlackout = await isDateBlackout(mentorkey, newDateTimeObj.toISOString().split('T')[0]);
    if (isBlackout) {
      return res.status(400).json({ message: 'Selected date is a blackout date for the mentor' });
    }

    // Check mentor availability
    const isAvailable = await isTimeWithinMentorAvailability(mentorkey, newDateTimeObj, duration);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Selected time is not within mentor availability' });
    }

    // Check for conflicts
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

// Route to get mentor assigned to mentee
router.get('/mentee/:menteekey/mentor', async (req, res) => {
  const { menteekey } = req.params;
  try {
    const [rows] = await pool.query(
      `
      SELECT u.userid AS mentorkey, u.name AS mentor_name
      FROM mentor_mentee_relationship r
      JOIN userInfo u ON r.mentorkey = u.userid
      WHERE r.menteekey = ?
      `,
      [menteekey]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'No mentor found for this mentee.' });
    }
  } catch (error) {
    console.error('Error fetching mentor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
