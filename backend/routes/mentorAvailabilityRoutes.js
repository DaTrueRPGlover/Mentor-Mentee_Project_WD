import express from 'express';
import { 
  getMentorAvailabilityByMentorKey, 
  getMentorAvailabilityByDay, 
  insertMentorAvailability, 
  deleteMentorAvailability, 
  updateMentorAvailability 
} from '../database_queries/MentorAvailabilityQueries.js';

const router = express.Router();

// Route to get all availability for a mentor
router.get('/mentor/:mentorkey/availability', async (req, res) => {
  try {
    const { mentorkey } = req.params;
    const availability = await getMentorAvailabilityByMentorKey(mentorkey);
    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch availability' });
  }
});

// Route to get availability by day for a mentor
router.get('/mentor/:mentorkey/availability/:dayOfWeek', async (req, res) => {
  try {
    const { mentorkey, dayOfWeek } = req.params;
    const availability = await getMentorAvailabilityByDay(mentorkey, dayOfWeek);
    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch availability for the specified day' });
  }
});

// Route to insert new availability for a mentor
router.post('/mentor/:mentorkey/availability', async (req, res) => {
  try {
    const { mentorkey } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;
    await insertMentorAvailability(mentorkey, dayOfWeek, startTime, endTime);
    res.status(201).json({ message: 'Availability inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to insert availability' });
  }
});

// Route to delete availability for a mentor
router.delete('/mentor/:mentorkey/availability', async (req, res) => {
  try {
    const { mentorkey } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;
    await deleteMentorAvailability(mentorkey, dayOfWeek, startTime, endTime);
    res.status(200).json({ message: 'Availability deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete availability' });
  }
});

// Route to update availability for a mentor
router.put('/mentor/:mentorkey/availability', async (req, res) => {
  try {
    const { mentorkey } = req.params;
    const { dayOfWeek, oldStartTime, oldEndTime, newStartTime, newEndTime } = req.body;
    await updateMentorAvailability(mentorkey, dayOfWeek, oldStartTime, oldEndTime, newStartTime, newEndTime);
    res.status(200).json({ message: 'Availability updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update availability' });
  }
});

export default router;