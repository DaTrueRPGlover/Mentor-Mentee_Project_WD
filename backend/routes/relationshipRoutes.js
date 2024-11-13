// relationshipRoutes.js

import express from 'express';
import { 
  createMentorMenteeRelationship, 
  updateMentorForMentee, 
  deleteMentorMenteeRelationship, 
  getAllMentorMenteeRelationships,
  getMentorMenteeRelationships

} from '../database_queries/RelationshipQueries.js';

const router = express.Router();
router.get('/mentees', async (req, res) => {
  const { mentorkey } = req.query;
  try {
    const relationships = await getMentorMenteeRelationships(mentorkey, 'mentor');
    res.json(relationships);
  } catch (error) {
    console.error('Error fetching mentees:', error);
    res.status(500).json({ error: 'Failed to fetch mentees' });
  }
});

// Fetch mentor assigned to a mentee
router.get('/mentor', async (req, res) => {
  const { menteekey } = req.query;
  try {
    const relationships = await getMentorMenteeRelationships(menteekey, 'mentee');
    res.json(relationships);
  } catch (error) {
    console.error('Error fetching mentor:', error);
    res.status(500).json({ error: 'Failed to fetch mentor' });
  }
});


// Fetch all mentor-mentee relationships
router.get('/', async (req, res) => {
  try {
    const relationships = await getAllMentorMenteeRelationships();
    res.json(relationships);
  } catch (error) {
    console.error('Error fetching relationships:', error);
    res.status(500).json({ error: 'Failed to fetch relationships' });
  }
});

// Assign mentor to mentee
router.post('/assign', async (req, res) => {
  const { mentorkey, menteekey } = req.body;
  try {
    await createMentorMenteeRelationship(mentorkey, menteekey);
    res.status(201).json({ message: 'Mentor assigned to mentee successfully' });
  } catch (error) {
    console.error('Error assigning mentor to mentee:', error);
    res.status(500).json({ error: 'Failed to assign mentor to mentee' });
  }
});

// Update mentor for mentee
router.put('/update', async (req, res) => {
  const { menteekey, mentorkey } = req.body;
  try {
    await updateMentorForMentee(menteekey, mentorkey);
    res.status(200).json({ message: 'Mentor updated successfully' });
  } catch (error) {
    console.error('Error updating mentor:', error);
    res.status(500).json({ error: 'Failed to update mentor' });
  }
});

// Delete mentor-mentee relationship
router.delete('/:relationship_id', async (req, res) => {
  const { relationship_id } = req.params;
  try {
    await deleteMentorMenteeRelationship(relationship_id);
    res.status(200).json({ message: 'Relationship deleted successfully' });
  } catch (error) {
    console.error('Error deleting relationship:', error);
    res.status(500).json({ error: 'Failed to delete relationship' });
  }
});

export default router;
