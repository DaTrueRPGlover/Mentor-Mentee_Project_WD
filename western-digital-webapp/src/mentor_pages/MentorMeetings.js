// MentorMeetings.js
import React, { useState, useEffect } from 'react';
import './MentorMeetings.css';
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

function MentorMeetings({ mentorkey }) {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedMentee, setSelectedMentee] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [zoomLink, setZoomLink] = useState('');
  const [zoomPassword, setZoomPassword] = useState('');

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const mentorinfo = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`http://localhost:3001/api/meetings/mentees?mentorkey=${mentorinfo.mentorkey}`);
        const data = await response.json();
        setMentees(data);
      } catch (error) {
        console.error('Error fetching mentees:', error);
      }
    };

    const fetchMeetings = async () => {
      try {
        const mentorinfo = JSON.parse(localStorage.getItem('user'));
        const mentorkey = mentorinfo.mentorkey;
        const response = await fetch(`http://localhost:3001/api/meetings/meetings?userId=${mentorkey}`);
        const data = await response.json();
        const mappedMeetings = data.map(meeting => ({
          title: `Meeting with ${meeting.mentee_name}`,
          start: new Date(meeting.datetime),
          end: new Date(new Date(meeting.datetime).getTime() + 60 * 60 * 1000),
          mentee_name: meeting.mentee_name,
          zoomLink: meeting.zoom_link,
          zoomPassword: meeting.zoom_password,
          meetingKey: meeting.meetingkey,
        }));
        setMeetings(mappedMeetings);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    fetchMentees();
    fetchMeetings();
  }, [mentorkey]);

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

  const handleScheduleMeeting = async () => {
    if (selectedMentee && newDate.trim() && newTime.trim() && zoomLink.trim() && zoomPassword.trim()) {
      const datetime = `${newDate}T${newTime}`;
      const mentorinfo = JSON.parse(localStorage.getItem('user'));

      try {
        const response = await fetch('http://localhost:3001/api/meetings/create-meeting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mentorkey: mentorinfo.mentorkey,
            menteekey: selectedMentee,
            datetime,
            zoom_link: zoomLink,
            zoom_password: zoomPassword,
          }),
        });

        if (response.status === 201) {
          const mentee = mentees.find(m => m.menteekey === selectedMentee);
          setMeetings([...meetings, {
            title: `Meeting with ${mentee.mentee_name}`,
            start: new Date(datetime),
            end: new Date(new Date(datetime).getTime() + 60 * 60 * 1000),
            mentee_name: mentee.mentee_name,
          }]);
          setSelectedMentee('');
          setNewDate('');
          setNewTime('');
          setZoomLink('');
          setZoomPassword('');
        } else if (response.status === 409) {
          alert('Time conflict! Please select a different time.');
        }
      } catch (error) {
        console.error('Error scheduling meeting:', error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="mentor-meetings">
      <header className="header-container">
        <div className="top-header">
          <button className="logo-button" onClick={() => navigate("/mentor-home")}>
            <img src={logo} alt="Logo" className="logo" />
          </button>
          <button className="logout-button" onClick={() => navigate("/")}>Logout</button>
        </div>
        <h1 className="welcome-message">Schedule Mentee Meetings</h1>
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
            <h3>Meeting with {selectedMeeting.mentee_name}</h3>
            <p>Zoom Link: {selectedMeeting.zoomLink}</p>
            <p>Zoom Password: {selectedMeeting.zoomPassword}</p>
            <p>Date: {selectedMeeting.start.toDateString()}</p>
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

      <h2>Schedule a New Meeting</h2>
      <div className="schedule-form">
        <select value={selectedMentee} onChange={(e) => setSelectedMentee(e.target.value)}>
          <option value="">Select a Mentee</option>
          {mentees.map((mentee) => (
            <option key={mentee.menteekey} value={mentee.menteekey}>
              {mentee.mentee_name}
            </option>
          ))}
        </select>
        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
        <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
        <input type="text" value={zoomLink} onChange={(e) => setZoomLink(e.target.value)} placeholder="Enter Zoom link" />
        <input type="text" value={zoomPassword} onChange={(e) => setZoomPassword(e.target.value)} placeholder="Enter Zoom password" />
        <button onClick={handleScheduleMeeting}>Schedule Meeting</button>
      </div>
    </div>
  );
}

export default MentorMeetings;
