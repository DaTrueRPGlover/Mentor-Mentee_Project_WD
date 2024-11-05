import React, { useState } from 'react';
import './MentorMeetings.css';
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import logo from '../assets/WDC.png';

function MentorMeetings() {
  const navigate = useNavigate(); // <-- Initialize navigate

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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="mentor-meetings">

    <header className="header-container">
    <div className="top-header">

      <button
        className="logo-button"
        onClick={() => navigate("/mentor-home")}
      >
        <img src={logo} alt="Logo" className="logo" />
      </button>

      <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>

      </div>
      <h1 className="welcome-message">Schedule Mentee Meetings</h1>
    </header>



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
