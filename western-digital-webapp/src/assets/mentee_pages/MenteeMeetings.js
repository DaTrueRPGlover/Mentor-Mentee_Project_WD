import React, { useState } from 'react';
import './MenteeMeetings.css'; // Import the updated CSS file

function MenteeMeetings() {
  const [meetings, setMeetings] = useState([
    { date: '2024-10-25', time: '10:00 AM', mentor: 'John Doe' },
    { date: '2024-11-01', time: '2:00 PM', mentor: 'Jane Smith' },
  ]);

  return (
    <div className="mentee-meetings">
      <h1>Scheduled Meetings</h1>
      <ul>
        {meetings.map((meeting, index) => (
          <li key={index}>
            Meeting with {meeting.mentor} on {meeting.date} at {meeting.time}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MenteeMeetings;
