// mentorBlackoutDatesRoutes.js
import express from 'express';
import {
  getBlackoutDatesByMentorKey,
  insertBlackoutDate,
  deleteBlackoutDate,
} from '../database_queries/mentorBlackoutDatesQueries.js';

const router = express.Router();

// Fetch blackout dates for a specific mentor
router.get('/mentor/:mentorkey/blackout-dates', async (req, res) => {
  try {
    const { mentorkey } = req.params;
    const blackoutDates = await getBlackoutDatesByMentorKey(mentorkey);
    res.json(blackoutDates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch blackout dates' });
  }
});

// Insert new blackout date
router.post('/mentor/:mentorkey/blackout-dates', async (req, res) => {
  try {
    const { mentorkey } = req.params;
    const { date, reason } = req.body;
    await insertBlackoutDate(mentorkey, date, reason);
    res.status(201).json({ message: 'Blackout date inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to insert blackout date' });
  }
});

// Delete blackout date
router.delete('/mentor/:mentorkey/blackout-dates', async (req, res) => {
  try {
    const { mentorkey } = req.params;
    const { date } = req.body;
    await deleteBlackoutDate(mentorkey, date);
    res.status(200).json({ message: 'Blackout date deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete blackout date' });
  }
});

export default router;
