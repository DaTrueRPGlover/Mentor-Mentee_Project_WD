import express from 'express';
import { createHomework, fetchHomeworkByMenteeKey, fetchHomeworkByMentorKey, fetchHomeworkById } from '../database_queries/HomeworkQueries.js';

const router = express.Router();

// Route to assign homework
router.post('/assign-homework', async (req, res) => {
  const { title, description, assignedDateTime, dueDateTime, mentees, mentorKey } = req.body;

  // Convert assignedDateTime and dueDateTime to date-only format (YYYY-MM-DD) for database compatibility
  const formattedAssignedDate = assignedDateTime ? assignedDateTime.split(' ')[0] : null;
  const formattedDueDate = dueDateTime ? dueDateTime.split(' ')[0] : null;

  try {
      // Ensure all fields are present
      if (!title || !description || !formattedAssignedDate || !formattedDueDate || !mentees || !mentorKey) {
          return res.status(400).json({ message: 'Missing required fields' });
      }

      // Assign homework for each mentee
      const homeworkIds = await Promise.all(
          mentees.map(menteeKey => 
              createHomework(menteeKey, mentorKey, title, description, formattedAssignedDate, formattedDueDate)
          )
      );

      res.status(201).json({ message: 'Homework assigned successfully', homeworkIds });
  } catch (error) {
      console.error('Error in /assign-homework route:', error);
      res.status(500).json({ message: 'Failed to assign homework', error: error.message });
  }
});

  router.get('/:homeworkId', async (req, res) => {
    const { homeworkId } = req.params;
  
    try {
      const homework = await fetchHomeworkById(homeworkId);
      res.status(200).json(homework);
      console.log("get HW", homework);
    } catch (error) {
      console.error('Error fetching homework by ID:', error);
      res.status(500).json({ message: 'Failed to fetch homework by ID', error: error.message });
    }
  });

// Route to fetch homework by menteeKey
router.get('/mentee/:menteeKey', async (req, res) => {
    const { menteeKey } = req.params;

    try {
        const homework = await fetchHomeworkByMenteeKey(menteeKey);
        console.log(homework);
        res.status(200).json(homework);
    } catch (error) {
        console.error('Error in /homework/mentee route:', error);
        res.status(500).json({ message: 'Failed to fetch homework by menteeKey', error: error.message });
    }
});

// Route to fetch homework by mentorKey
router.get('/mentor/:mentorKey', async (req, res) => {
    const { mentorKey } = req.params;

    try {
        const homework = await fetchHomeworkByMentorKey(mentorKey);
        res.status(200).json(homework);
    } catch (error) {
        console.error('Error in /homework/mentor route:', error);
        res.status(500).json({ message: 'Failed to fetch homework by mentorKey', error: error.message });
    }
});

export default router;
