import express from 'express';
import { generateICS } from '../controllers/calendarController.js'; // Import the generateICS function

const router = express.Router();

// Route to generate ICS for a specific user
router.get('/generate-ics/:userId', generateICS);

export default router;

