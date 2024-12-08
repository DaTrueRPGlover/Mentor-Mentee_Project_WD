import * as MeetingQueries from '../database_queries/MeetingQueries.js';
import pool from '../database.js';

const testMeetingQueries = async () => {
  try {
    const userId = '2d9f4b3a-987f-11ef-a92b-02a12f7436d7'; // Replace with an actual user ID from your database
    const startDate = '2024-12-01 00:00:00';
    const endDate = '2024-12-06 23:59:59';

    console.log("Testing getMeetingsForUser...");
    const meetings = await MeetingQueries.getMeetingsForUser(userId);
    console.log("Meetings for User:", meetings);

    console.log("Testing getMeetingsForUserByDateRange...");
    const meetingsByDateRange = await MeetingQueries.getMeetingsForUserByDateRange(userId, startDate, endDate);
    console.log("Meetings within Date Range:", meetingsByDateRange);

    console.log("Testing createMeeting...");
    await MeetingQueries.createMeeting('mentor-id', 'mentee-id', '2024-12-15 14:00:00', 'https://zoom.us/j/meeting-id', 'password123');
    console.log("Meeting created successfully.");

    console.log("Testing checkMeetingConflict...");
    const conflicts = await MeetingQueries.checkMeetingConflict('mentor-id', 'mentee-id', '2024-12-15 14:00:00', 60);
    console.log("Conflicts found:", conflicts);

  } catch (error) {
    console.error("Error testing MeetingQueries:", error);
  } finally {
    pool.end(); // Close the database connection
  }
};

testMeetingQueries();
