import express from "express";
import {
  getMessagesByConversationKey,
  createCheckConversationKey,
  insertMessage,
} from "../database_queries/ConversationQueries.js";

const router = express.Router();

import { clients } from "../index.js";

// route to get all messages between a mentor and mentee
router.get("/", async (req, res) => {
  const { menteekey, mentorkey } = req.query;

  console.log("GET /api/messages", req.query);

  if (!menteekey || !mentorkey) {
    return res.status(400).json({ error: "Missing mentee or mentor key" });
  }

  try {
    const conversationKey = await createCheckConversationKey(menteekey, mentorkey);
    console.log("Obtained conversationKey:", conversationKey);

    const messages = await getMessagesByConversationKey(conversationKey);
    res.status(200).json({ messages, conversationKey });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// route to send a message
router.post("/", async (req, res) => {
  const { conversationKey, menteekey, mentorkey, senderRole, messageText } = req.body;

  console.log("POST /api/messages", req.body);

  if (!conversationKey || !senderRole || !messageText) {
    return res.status(400).json({ error: "Invalid message data" });
  }

  try {
    // Use the provided conversationKey directly
    console.log("Received conversationKey:", conversationKey);

    const messageId = await insertMessage(conversationKey, senderRole, messageText);

    const newMessage = {
      conversation_key: conversationKey,
      message: messageText,
      senderRole,
      timestamp: new Date().toISOString(),
    };

    // Notify WebSocket clients
    const clientSet = clients.get(conversationKey);
    if (clientSet) {
      clientSet.forEach((wsClient) => {
        if (wsClient.readyState === wsClient.OPEN) {
          wsClient.send(JSON.stringify(newMessage));
        }
      });
    }

    res.status(201).json({ messageId });
  } catch (error) {
    console.error("Error inserting message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
