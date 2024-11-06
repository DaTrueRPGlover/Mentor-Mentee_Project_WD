// routes/messageRoutes.js
import express from 'express';
import {
  getMessagesByMenteeKey,
  getMessagesByMentorKey,
  createCheckConversationKey,
  insertMessage,
} from '../database_queries/ConversationQueries.js';

const router = express.Router();

// Route to get all messages for a user based on their role
router.get('/', async (req, res) => {
  const { role, key } = req.query;

  try {
    let messages;
    if (role === 'mentee') {
      messages = await getMessagesByMenteeKey(key);
      console.log("Messageing Here:", messages);
    } else if (role === 'mentor') {
      messages = await getMessagesByMentorKey(key);
      console.log("Messageing Here:",messages);
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Route to send a message
router.post('/', async (req, res) => {
  const { menteekey, mentorkey, menteetext, mentortext, isMentee, isMentor } = req.body;

  try {
    const conversationKey = await createCheckConversationKey(menteekey, mentorkey);
    const senderRole = isMentee ? 'mentee' : isMentor ? 'mentor' : null;
    const messageText = isMentee ? menteetext : mentortext;

    if (!senderRole || !messageText) {
      return res.status(400).json({ error: 'Invalid message data' });
    }

    const messageId = await insertMessage(conversationKey, senderRole, messageText);
    res.status(201).json({ messageId });
  } catch (error) {
    console.error('Error inserting message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
