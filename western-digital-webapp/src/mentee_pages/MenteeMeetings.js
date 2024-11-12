import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import './MenteeMeetings.css';
import { useNavigate } from "react-router-dom";
import logo from '../assets/WDC.png';

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
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [open, setOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.userId;

        const response = await axios.get('http://localhost:3001/api/meetings/meetings', {
          params: { userId },
        });
        const meetingsData = response.data.map((meeting) => ({
          title: `Meeting with ${
            userId === meeting.mentorkey ? meeting.mentee_name : meeting.mentor_name
          }`,
          start: new Date(meeting.datetime),
          end: new Date(new Date(meeting.datetime).getTime() + 60 * 60 * 1000),
          duration: new Date(new Date(meeting.datetime).getTime() + 60 * 60 * 1000) - new Date(meeting.datetime),
          mentor: meeting.mentor_name,
          mentee: meeting.mentee_name,
          link: meeting.zoom_link,
          zoom_password: meeting.zoom_password,
          meetingKey: meeting.meetingkey,
        }));
        setMeetings(meetingsData);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };
    fetchMeetings();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedMeeting(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMeeting(null);
  };

  const handleRescheduleClose = () => {
    setRescheduleOpen(false);
    setRescheduleDate('');
    setRescheduleTime('');
  };

  const handleCancelMeeting = async () => {
    try {
      await axios.post('http://localhost:3001/api/meetings/cancel', {
        meetingKey: selectedMeeting.meetingKey,
      });
      alert('Meeting canceled successfully.');
      setMeetings(meetings.filter(meeting => meeting.meetingKey !== selectedMeeting.meetingKey));
      handleClose();
    } catch (error) {
      alert('Error canceling the meeting.');
      console.error('Cancel error:', error);
    }
  };

  const openRescheduleDialog = () => {
    setRescheduleOpen(true);
  };

  const handleRescheduleMeeting = async () => {
    const newStart = new Date(`${rescheduleDate}T${rescheduleTime}`);
    const newEnd = new Date(newStart.getTime() + selectedMeeting.duration); // Keep the original duration
  
    try {
      const response = await axios.post('http://localhost:3001/api/meetings/reschedule', {
        meetingKey: selectedMeeting.meetingKey,
        newDateTime: newStart,
      });
  
      if (response.status === 200) {
        alert(`Meeting rescheduled to ${newStart.toLocaleString()}.`);
        setMeetings(
          meetings.map(meeting =>
            meeting.meetingKey === selectedMeeting.meetingKey
              ? { ...meeting, start: newStart, end: newEnd }
              : meeting
          )
        );
        handleClose();
        handleRescheduleClose();
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('Time conflict detected! Please select a different time.');
      } else {
        alert('Error rescheduling the meeting.');
        console.error('Reschedule error:', error);
      }
    }
  };
  

  const navigate = useNavigate();
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
            onClick={() => navigate("/mentee-home")}
          >
            <img src={logo} alt="Logo" className="logo" />
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h1 className="welcome-message">View Meetings</h1>
      </header>

      <Calendar
        localizer={localizer}
        events={meetings}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        className="calendar"
        style={{ backgroundColor: 'white' }}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Meeting Details</DialogTitle>
        <DialogContent>
          {selectedMeeting && (
            <div>
              <p><strong>Title:</strong> {selectedMeeting.title}</p>
              <p><strong>Mentor:</strong> {selectedMeeting.mentor}</p>
              <p><strong>Mentee:</strong> {selectedMeeting.mentee}</p>
              <p><strong>Start Time:</strong> {selectedMeeting.start.toLocaleString()}</p>
              <p><strong>End Time:</strong> {selectedMeeting.end.toLocaleString()}</p>
              <p><strong>Meeting Link:</strong> <a href={selectedMeeting.link} target="_blank" rel="noopener noreferrer">{selectedMeeting.link}</a></p>
              <p><strong>Zoom Password:</strong> {selectedMeeting.zoom_password}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelMeeting} color="secondary">Cancel Meeting</Button>
          <Button onClick={openRescheduleDialog} color="primary">Reschedule</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Separate Popup for Rescheduling */}
      <Dialog open={rescheduleOpen} onClose={handleRescheduleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Reschedule Meeting</DialogTitle>
        <DialogContent>
          <input
            type="date"
            value={rescheduleDate}
            onChange={(e) => setRescheduleDate(e.target.value)}
            className="date-input"
          />
          <input
            type="time"
            value={rescheduleTime}
            onChange={(e) => setRescheduleTime(e.target.value)}
            className="time-input"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRescheduleClose}>Cancel</Button>
          <Button onClick={handleRescheduleMeeting} color="primary">Confirm Reschedule</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MenteeMeetings;
