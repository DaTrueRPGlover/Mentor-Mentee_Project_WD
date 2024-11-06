// routes/relationshipRoutes.js
import express from 'express';
import { getMentorMenteeRelationship } from '../database_queries/RelationshipQueries.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { userid, role } = req.query;

  console.log('GET /api/relationships', req.query);

  if (!userid || !role) {
    return res.status(400).json({ error: 'Missing userid or role' });
  }

  try {
    const relationship = await getMentorMenteeRelationship(userid, role);
    res.status(200).json(relationship);
  } catch (error) {
    console.error('Error fetching relationship:', error);
    res.status(500).json({ error: 'Failed to fetch relationship' });
  }
});

export default router;
