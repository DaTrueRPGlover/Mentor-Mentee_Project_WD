import ical from 'ical-generator';
import { v4 as uuidv4 } from 'uuid';
import { getMeetingsForUserByDateRange } from '../database_queries/MeetingQueries.js'; // Adjust this import path as needed

export const generateICS = async (req, res) => {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({
            message: 'Missing required query parameters: startDate and endDate',
        });
    }

    try {
        const meetings = await getMeetingsForUserByDateRange(userId, startDate, endDate);
        if (!meetings.length) {
            return res.status(404).json({ message: 'No meetings found in the specified date range.' });
        }

        const cal = ical({ name: 'Mentor-Mentee Meetings' });

        // Add events to the calendar
        meetings.forEach((meeting) => {
            cal.createEvent({
                start: new Date(meeting.datetime),
                end: new Date(new Date(meeting.datetime).getTime() + 60 * 60 * 1000), // Assuming 1-hour duration
                summary: `Meeting with ${meeting.mentee_name || meeting.mentor_name}`,
                description: `Meeting Link: ${meeting.meeting_link}\nPassword: ${meeting.meeting_password}`,
                location: meeting.meeting_link || 'Online',
                uid: meeting.meetingkey || uuidv4(),
            });
        });

        // Set headers for ICS file download
        res.setHeader('Content-Type', 'text/calendar');
        res.setHeader('Content-Disposition', 'attachment; filename="meetings.ics"');

        // Send the ICS file as a response
        res.send(cal.toString()); // Convert the calendar to a string and send it

    } catch (error) {
        console.error('Failed to generate ICS file:', error);
        res.status(500).json({ message: 'Failed to generate calendar file' });
    }
};

