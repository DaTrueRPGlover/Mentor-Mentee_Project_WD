// MenteeMeetings.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


import { motion } from "framer-motion"; // Importing motion
import logo from "../assets/WDC2.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import assign from "../assets/assign.png";
import calendar from "../assets/calendar.png";
import logout from "../assets/logout.png";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  TextField,
  Box,
  Select,
  MenuItem
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import enUS from 'date-fns/locale/en-US';
import './MenteeMeetings.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format: (date, formatString) => format(date, formatString, { locale: enUS }),
  parse: (dateString, formatString) => parse(dateString, formatString, new Date(), { locale: enUS }),
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1, locale: enUS }),
  getDay,
  locales,
});

function MenteeMeetings() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const userInfo = JSON.parse(sessionStorage.getItem('user'));
  const menteeKey = userInfo?.menteekey;
  const user = JSON.parse(sessionStorage.getItem("user"));
  const name = user['name']
  console.log(user);
  console.log(name)
  const menteeName = name|| "Mentee";
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.className = isDarkMode ? "" : "dark-mode";
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const menteeInfo = JSON.parse(sessionStorage.getItem('user'));
        const userId = menteeInfo.userId;
        const [meetingsResponse, homeworkResponse, mentorResponse] = await Promise.all([
          fetch(`http://localhost:3001/api/meetings/meetings?userId=${userId}`),
          fetch(`http://localhost:3001/api/homework/mentee/${userId}`),
          fetch(`http://localhost:3001/api/meetings/mentee/${userId}/mentor`)
        ]);

        const meetingsData = await meetingsResponse.json();
        const homeworkData = await homeworkResponse.json();
        const mentorData = await mentorResponse.json();

        setMentor(mentorData);

        const mappedMeetings = meetingsData.map(meeting => ({
          title: `Meeting with ${meeting.mentor_name}`,
          start: new Date(meeting.datetime),
          end: new Date(new Date(meeting.datetime).getTime() + 60 * 60 * 1000),
          type: 'meeting',
          mentor_name: meeting.mentor_name,
          zoomLink: meeting.meeting_link,
          zoomPassword: meeting.meeting_password,
          meetingKey: meeting.meetingkey,
        }));

        const mappedHomework = homeworkData.map(homework => ({
          title: `Homework: ${homework.title}`,
          start: new Date(homework.due_date),
          end: new Date(homework.due_date),
          type: 'homework',
          description: homework.description,
        }));

        setEvents([...mappedMeetings, ...mappedHomework]);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (mentor && selectedDate) {
        try {
          // Check if selected date is a blackout date
          const blackoutResponse = await fetch(`http://localhost:3001/api/mentor/${mentor.mentorkey}/blackout-dates`);
          const blackoutData = await blackoutResponse.json();
          const isBlackoutDate = blackoutData.some(bd => bd.date === selectedDate);
          if (isBlackoutDate) {
            setAvailableTimeSlots([]);
            alert('Selected date is not available due to mentor blackout');
            return;
          }

          const dayOfWeek = new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' });
          const response = await fetch(`http://localhost:3001/api/mentor/${mentor.mentorkey}/availability/${dayOfWeek}`);
          const data = await response.json();

          // Fetch mentor's meetings on selected date
          const meetingsResponse = await fetch(`http://localhost:3001/api/meetings/mentors/${mentor.mentorkey}`);
          const meetingsData = await meetingsResponse.json();

          // Filter meetings to the selected date
          const meetingsOnSelectedDate = meetingsData.filter(meeting => {
            const meetingDate = new Date(meeting.datetime);
            return meetingDate.toDateString() === new Date(selectedDate).toDateString();
          });

          // Build a list of occupied time slots
          const occupiedSlots = meetingsOnSelectedDate.map(meeting => {
            const startTime = new Date(meeting.datetime).toTimeString().split(' ')[0]; // 'HH:MM:SS'
            const endTime = new Date(new Date(meeting.datetime).getTime() + 60 * 60 * 1000).toTimeString().split(' ')[0];
            return { startTime, endTime };
          });

          // Build available time slots by subtracting occupied slots from availability
          const availableSlots = [];

          data.forEach(avail => {
            let startTime = avail.start_time;
            let endTime = avail.end_time;

            // Exclude occupied slots
            occupiedSlots.forEach(occ => {
              if (occ.startTime >= startTime && occ.endTime <= endTime) {
                if (occ.startTime > startTime) {
                  availableSlots.push({ startTime, endTime: occ.startTime });
                }
                startTime = occ.endTime;
              }
            });

            if (startTime < endTime) {
              availableSlots.push({ startTime, endTime });
            }
          });

          // For simplicity, create 1-hour time slots
          const timeSlots = [];

          availableSlots.forEach(slot => {
            let start = new Date(`${selectedDate}T${slot.startTime}`);
            const end = new Date(`${selectedDate}T${slot.endTime}`);
            while (start < end) {
              const nextSlot = new Date(start.getTime() + 60 * 60 * 1000);
              if (nextSlot <= end) {
                timeSlots.push({
                  startTime: start.toTimeString().split(' ')[0],
                  endTime: nextSlot.toTimeString().split(' ')[0],
                });
              }
              start = nextSlot;
            }
          });

          setAvailableTimeSlots(timeSlots);

        } catch (error) {
          console.error('Error fetching availability:', error);
        }
      }
    };

    fetchAvailability();
  }, [mentor, selectedDate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleOpenScheduleDialog = () => {
    setShowScheduleDialog(true);
    setSelectedDate('');
    setSelectedTimeSlot('');
    setAvailableTimeSlots([]);
  };

  const handleCloseScheduleDialog = () => {
    setShowScheduleDialog(false);
  };

  const handleScheduleMeeting = async () => {
    if (selectedDate && selectedTimeSlot) {
      const datetime = `${selectedDate}T${selectedTimeSlot}`;
      try {
        const menteeInfo = JSON.parse(sessionStorage.getItem('user'));
        const userId = menteeInfo.userId;

        const response = await fetch('http://localhost:3001/api/meetings/create-meeting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mentorkey: mentor.mentorkey,
            menteekey: userId,
            datetime,
            meeting_link: '',
            meeting_password: '',
          }),
        });

        if (response.status === 201) {
          // Success
          handleCloseScheduleDialog();
          // Refresh meetings
          const meetingsResponse = await fetch(`http://localhost:3001/api/meetings/meetings?userId=${userId}`);
          const meetingsData = await meetingsResponse.json();
          const mappedMeetings = meetingsData.map(meeting => ({
            title: `Meeting with ${meeting.mentor_name}`,
            start: new Date(meeting.datetime),
            end: new Date(new Date(meeting.datetime).getTime() + 60 * 60 * 1000),
            type: 'meeting',
            mentor_name: meeting.mentor_name,
            zoomLink: meeting.zoom_link,
            zoomPassword: meeting.zoom_password,
            meetingKey: meeting.meetingkey,
          }));
          setEvents([...mappedMeetings]);
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error('Error scheduling meeting:', error);
      }
    } else {
      alert('Please select a date and time slot.');
    }
  };

  const handleRescheduleMeeting = async () => {
    const newDateTime = `${newDate}T${newTime}`;
    try {
      const response = await fetch('http://localhost:3001/api/meetings/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingKey: selectedEvent.meetingKey, newDateTime }),
      });

      if (response.status === 409) {
        alert('Time conflict! Please select a different time.');
      } else if (response.ok) {
        setEvents(events.map(event =>
          event.meetingKey === selectedEvent.meetingKey
            ? { ...event, start: new Date(newDateTime), end: new Date(new Date(newDateTime).getTime() + 60 * 60 * 1000) }
            : event
        ));
        setSelectedEvent(null);
        setNewDate('');
        setNewTime('');
      } else {
        const data = await response.json();
        alert(data.message || 'Error rescheduling meeting.');
      }
    } catch (error) {
      console.error('Error rescheduling meeting:', error);
    }
  };

  return (
    <div className='mentee-meetings'>

      <div className="logo-title-container">
          <img src={logo} alt="logo" className="logo" />
          <h1 className="title-header">Meetings</h1>
    </div>
    <div className="sidebarA">
        {/* Navigation Buttons */}
        <div className="nav-buttonsA">
          <motion.button
            className="icon"
            onClick={() => navigate("/interact-mentor")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/todo-progression")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={write} alt="write" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/check-hw")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={assign} alt="assign" />
          </motion.button>
          <motion.button
            className="icon1"
            onClick={() => navigate("/mentee-meetings")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={calendar} alt="calendar" />
          </motion.button>
        </div>

        {/* Logout Button */}
        <div className="slider-section">
          <span role="img" aria-label="Sun"></span>
          <label className="slider-container">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
          <span role="img" aria-label="Moon"></span>
        </div>
        <motion.button
          className="logout-buttonV2"
          onClick={handleLogout}
          whileHover={{ scale: 1.1 }} // Growing effect on hover
          transition={{ duration: 0.3 }}
        >
          <img src={logout} alt="logout" />
        </motion.button>
      </div>

      <div className="content-wrapperVA">
        <div className="chat-boxA">
          <div className="box1">
          <div className="box">
        
          <div className="main-content">
      <div style={{ padding: '20px', width: '100%', }}>
        <Button variant="contained" color="primary" onClick={handleOpenScheduleDialog}>
          Schedule New Meeting
        </Button>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, marginTop: '20px', color: 'black', width: '100%', }}
          onSelectEvent={(event) => {
            setSelectedEvent(event);
            setNewDate('');
            setNewTime('');
          }}
        />
      </div>

      {selectedEvent && (
        <Dialog open={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedEvent.type === 'meeting'
              ? `Meeting with ${selectedEvent.mentor_name}`
              : selectedEvent.title}
          </DialogTitle>
          <DialogContent>
            {selectedEvent.type === 'meeting' ? (
              <>
                <Typography>Zoom Link: <Link href={selectedEvent.zoomLink} target="_blank">{selectedEvent.zoomLink}</Link></Typography>
                <Typography>Zoom Password: {selectedEvent.zoomPassword}</Typography>
                <Typography>Date: {selectedEvent.start.toLocaleDateString()}</Typography>
                <Typography>Time: {selectedEvent.start.toLocaleTimeString()}</Typography>
                <Typography variant="h6" gutterBottom>Reschedule Meeting</Typography>
                <Box display="flex" flexDirection="column" gap={2} mt={2}>
                  <TextField
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    label="New Date"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    label="New Time"
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </>
            ) : (
              <>
                <Typography>Description: {selectedEvent.description}</Typography>
                <Typography>Due Date: {new Date(selectedEvent.start).toLocaleDateString()}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            {selectedEvent.type === 'meeting' ? (
              <>
                <Button onClick={handleRescheduleMeeting} color="primary">Reschedule</Button>
                <Button onClick={() => setSelectedEvent(null)} color="secondary">Close</Button>
              </>
            ) : (
              <Button onClick={() => setSelectedEvent(null)} color="primary">Close</Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={showScheduleDialog} onClose={handleCloseScheduleDialog}>
        <DialogTitle>Schedule New Meeting</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              label="Select Date"
              InputLabelProps={{ shrink: true }}
            />
            <Select
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>Select a Time Slot</MenuItem>
              {availableTimeSlots.map((slot, index) => (
                <MenuItem key={index} value={slot.startTime}>
                  {slot.startTime} - {slot.endTime}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleScheduleMeeting} color="primary">Schedule</Button>
          <Button onClick={handleCloseScheduleDialog} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
      </div>
      </div>
      </div>
      </div>
      </div>

    </div>
  );
}

export default MenteeMeetings;
