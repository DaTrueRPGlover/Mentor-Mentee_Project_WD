// MenteeMeetings.js
import React, { useState, useEffect } from 'react';
import './MenteeMeetings.css';
import { useNavigate } from "react-router-dom";
import logo from '../assets/WDC.png';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

function MenteeMeetings() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const menteeInfo = JSON.parse(localStorage.getItem('user'));
        const userId = menteeInfo.userId;
        const response = await fetch(`http://localhost:3001/api/meetings/meetings?userId=${userId}`);
        const data = await response.json();
        const mappedMeetings = data.map(meeting => ({
          title: `Meeting with ${meeting.mentor_name}`,
          start: new Date(meeting.datetime),
          end: new Date(new Date(meeting.datetime).getTime() + 60 * 60 * 1000),
          mentor_name: meeting.mentor_name,
          zoomLink: meeting.zoom_link,
          zoomPassword: meeting.zoom_password,
          meetingKey: meeting.meetingkey,
        }));
        setMeetings(mappedMeetings);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    fetchMeetings();
  }, []);

  const handleSelectMeeting = (event) => {
    setSelectedMeeting(event);
  };

  const handleClosePopup = () => {
    setSelectedMeeting(null);
    setNewDate('');
    setNewTime('');
  };

  const handleCancelMeeting = async () => {
    try {
      await fetch('http://localhost:3001/api/meetings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingKey: selectedMeeting.meetingKey }),
      });
      setMeetings(meetings.filter(meeting => meeting.meetingKey !== selectedMeeting.meetingKey));
      handleClosePopup();
    } catch (error) {
      console.error('Error canceling meeting:', error);
    }
  };

  const handleRescheduleMeeting = async () => {
    const newDateTime = `${newDate}T${newTime}`;
    try {
      const response = await fetch('http://localhost:3001/api/meetings/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingKey: selectedMeeting.meetingKey, newDateTime }),
      });

      if (response.status === 409) {
        alert('Time conflict! Please select a different time.');
      } else if (response.ok) {
        setMeetings(meetings.map(meeting =>
          meeting.meetingKey === selectedMeeting.meetingKey
            ? { ...meeting, start: new Date(newDateTime), end: new Date(new Date(newDateTime).getTime() + 60 * 60 * 1000) }
            : meeting
        ));
        handleClosePopup();
      } else {
        alert('Error rescheduling meeting.');
      }
    } catch (error) {
      console.error('Error rescheduling meeting:', error);
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
          <button className="logo-button" onClick={() => navigate("/mentee-home")}>
            <img src={logo} alt="Logo" className="logo" />
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h1 className="welcome-message">View Meetings</h1>
      </header>

      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={meetings}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: '20px 0' }}
          className="calendar"
          onSelectEvent={handleSelectMeeting}
        />
      </div>

      {selectedMeeting && (
  <div className="popup">
    <div className="popup-content">
      <h3>Meeting with {selectedMeeting.mentor_name}</h3>
      <p>
        Zoom Link: 
        <a 
          href={selectedMeeting.zoomLink} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {selectedMeeting.zoomLink}
        </a>
      </p>
      <p>Zoom Password: {selectedMeeting.zoomPassword}</p>
      <p>Date: {selectedMeeting.start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      <p>Time: {selectedMeeting.start.toLocaleTimeString()}</p>

      <h4>Reschedule Meeting</h4>
      <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
      <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
      <button onClick={handleRescheduleMeeting}>Reschedule</button>
      <button onClick={handleCancelMeeting}>Cancel Meeting</button>
      <button onClick={handleClosePopup}>Close</button>
    </div>
  </div>
)}
    </div>
  );
}

export default MenteeMeetings;
