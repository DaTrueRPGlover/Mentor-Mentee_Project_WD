import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Use the imported routes
app.use('/api/users', userRoutes);
console.log("Login attempted")
app.use('/api/meetings', meetingRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
