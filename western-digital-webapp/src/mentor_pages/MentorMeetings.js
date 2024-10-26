import React, { useState } from 'react';
import './MentorMeetings.css';

function MentorMeetings() {
  const [meetings, setMeetings] = useState([
    { mentee: 'Jane Smith', date: '2024-10-25', time: '10:00 AM' },
    { mentee: 'Mark White', date: '2024-11-01', time: '2:00 PM' },
  ]);
  const [newMentee, setNewMentee] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleScheduleMeeting = () => {
    if (newMentee.trim() && newDate.trim() && newTime.trim()) {
      setMeetings([...meetings, { mentee: newMentee, date: newDate, time: newTime }]);
      setNewMentee('');
      setNewDate('');
      setNewTime('');
    }
  };

  return (
    <div className="mentor-meetings">
      <h1>Scheduled Meetings with Mentees</h1>
      <ul>
        {meetings.map((meeting, index) => (
          <li key={index}>
            Meeting with <strong>{meeting.mentee}</strong> on {meeting.date} at {meeting.time}
          </li>
        ))}
      </ul>

      <h2>Schedule a New Meeting</h2>
      <div className="schedule-form">
        <input
          type="text"
          value={newMentee}
          onChange={(e) => setNewMentee(e.target.value)}
          placeholder="Enter mentee name"
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
        />
        <button onClick={handleScheduleMeeting}>Schedule Meeting</button>
      </div>
    </div>
  );
}

export default MentorMeetings;
