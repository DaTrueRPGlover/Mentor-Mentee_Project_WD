// mentorAvailabilityRoutes.js
import express from 'express';
import { 
  getMentorAvailabilityByMentorKey, 
  getMentorAvailabilityByDay, 
  insertMentorAvailability, 
  deleteMentorAvailability, 
  updateMentorAvailability,
  hasOverlappingAvailability // Import the new validation function
} from '../database_queries/MentorAvailabilityQueries.js'

const router = express.Router();

// Fetch availability for a specific mentor
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

// Fetch availability by day
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

// Insert new availability with overlap validation
router.post('/mentor/:mentorkey/availability', async (req, res) => {
  try {
    const { mentorkey } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;

    // Validate overlapping availability
    const overlap = await hasOverlappingAvailability(mentorkey, dayOfWeek, startTime, endTime);
    if (overlap) {
      return res.status(400).json({ message: 'New availability time overlaps with existing availability.' });
    }

    await insertMentorAvailability(mentorkey, dayOfWeek, startTime, endTime);
    res.status(201).json({ message: 'Availability inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to insert availability' });
  }
});

// Delete availability
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

// Update availability with overlap validation
router.put('/mentor/:mentorkey/availability', async (req, res) => {
  try {
    const { mentorkey } = req.params;
    const { dayOfWeek, oldStartTime, oldEndTime, newStartTime, newEndTime } = req.body;

    // Validate overlapping availability excluding the current slot being edited
    const overlap = await hasOverlappingAvailability(mentorkey, dayOfWeek, newStartTime, newEndTime, { oldStartTime, oldEndTime });
    if (overlap) {
      return res.status(400).json({ message: 'Edited availability time overlaps with existing availability.' });
    }

    await updateMentorAvailability(mentorkey, dayOfWeek, oldStartTime, oldEndTime, newStartTime, newEndTime);
    res.status(200).json({ message: 'Availability updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update availability' });
  }
});

export default router;
