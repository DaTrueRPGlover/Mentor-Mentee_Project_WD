// index.js
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

// Import route modules
import userRoutes from './routes/userRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import createRoutes from './routes/accountRoutes.js';
import homeworkRoutes from './routes/homeworkRoutes.js';
import mentorRoutes from './routes/MentorlookupRoutes.js';
import menteeRoutes from './routes/MenteelookupRoutes.js';
import menteeNotesRoutes from './routes/menteeNotesRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import relationshipRoutes from './routes/relationshipRoutes.js';
import mentorNotesRoutes from './routes/mentorNotesRoutes.js';
import mentorAvailabilityRoutes from './routes/mentorAvailabilityRoutes.js';
import mentorBlackoutDatesRoutes from './routes/mentorBlackoutRoutes.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Use imported routes
app.use('/api/users', userRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/accounts', createRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/menteeNotes', menteeNotesRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/relationships', relationshipRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentees', menteeRoutes);
app.use('/api/mentorNotes', mentorNotesRoutes);
app.use('/api', mentorAvailabilityRoutes);
app.use('/api', mentorBlackoutDatesRoutes); // Added this line

const PORT = 3001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Set up WebSocket server
const wss = new WebSocketServer({ server });
export const clients = new Map();

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log("WebSocket received:", data);

    if (data.type === "subscribe" && data.conversation_key) {
      let clientSet = clients.get(data.conversation_key);
      if (!clientSet) {
        clientSet = new Set();
        clients.set(data.conversation_key, clientSet);
      }
      clientSet.add(ws);
      console.log("Client subscribed to conversation:", data.conversation_key);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");

    for (const [conversation_key, clientSet] of clients.entries()) {
      if (clientSet.has(ws)) {
        clientSet.delete(ws);
        console.log(`Removed client from conversation: ${conversation_key}`);
        if (clientSet.size === 0) {
          clients.delete(conversation_key);
        }
      }
    }
  });
});
