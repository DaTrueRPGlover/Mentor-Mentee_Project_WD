// index.js
import express from 'express';
import cors from 'cors';
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

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Use the imported routes
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
