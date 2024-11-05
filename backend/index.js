import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import createRoutes from './routes/accountRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Use the imported routes
app.use('/api/users', userRoutes);
console.log("Login")
app.use('/api/meetings', meetingRoutes);
app.use('/api/accounts', createRoutes);
app.use('/api/messages', messageRoutes);  // New route for messages

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
