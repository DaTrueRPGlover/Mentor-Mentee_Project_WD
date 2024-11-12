// routes/messageRoutes.js
import express from 'express';
import {
  getMessagesByMentorAndMentee,
  createCheckConversationKey,
  insertMessage,
} from '../database_queries/ConversationQueries.js';

const router = express.Router();

// route to get all messages between a mentor and mentee
router.get('/', async (req, res) => {
  const { menteekey, mentorkey } = req.query;

  console.log('GET /api/messages', req.query);

  if (!menteekey || !mentorkey) {
    return res.status(400).json({ error: 'Missing mentee or mentor key' });
  }

  try {
    const messages = await getMessagesByMentorAndMentee(mentorkey, menteekey);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});



// route to send a message
router.post('/', async (req, res) => {
  const { menteekey, mentorkey, senderRole, messageText } = req.body;

  console.log('POST /api/messages', req.body);

  if (!menteekey || !mentorkey || !senderRole || !messageText) {
    return res.status(400).json({ error: 'Invalid message data' });
  }

  try {
    const conversationKey = await createCheckConversationKey(menteekey, mentorkey);
    console.log('Obtained conversationKey:', conversationKey);

    const messageId = await insertMessage(conversationKey, senderRole, messageText);
    res.status(201).json({ messageId });
  } catch (error) {
    console.error('Error inserting message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
