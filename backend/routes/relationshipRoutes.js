// relationshipRoutes.js

import express from 'express';
import { createMentorMenteeRelationship,  updateMentorForMentee } from '../database_queries/AdminQueries.js';
import {getMentorMenteeRelationships }from '../database_queries/RelationshipQueries.js';
const router = express.Router();

// Fetch mentor-mentee relationships
router.get('/', async (req, res) => {
    try {
        const relationships = await getMentorMenteeRelationships();
        res.json(relationships);
    } catch (error) {
        console.error('Error fetching relationships:', error);
        res.status(500).json({ error: 'Failed to fetch relationships' });
    }
});

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

// Assign mentor to mentee
router.post('/assign', async (req, res) => {
    const { mentorkey, menteekey } = req.body;
    try {
        await createMentorMenteeRelationship(mentorkey, menteekey);
        res.status(201).json({ message: 'Mentor assigned to mentee successfully' });
    } catch (error) {
        console.error('Error assigning mentor to mentee:', error);
        if (error.message === 'Mentor and mentee are already assigned to each other') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to assign mentor to mentee' });
        }
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

export default router;

