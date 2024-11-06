import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import createRoutes from './routes/accountRoutes.js';
import homeworkRoutes from './routes/homeworkRoutes.js';
import mentorRoutes from './routes/men.js';  // Import the mentor routes from men.js
import menteeRoutes from './routes/me.js';  // Import the mentee routes from me.js
import menteeNotesRoutes from './routes/menteeNotesRoutes.js';

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Use the imported routes
app.use('/api/users', userRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/accounts', createRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/menteeNotes', menteeNotesRoutes);

// Define specific routes for mentor and mentee names
app.use('/api/mentors', mentorRoutes);  // Mentor names route (from men.js)
app.use('/api/mentees', menteeRoutes);  // Mentee names route (from me.js)

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
