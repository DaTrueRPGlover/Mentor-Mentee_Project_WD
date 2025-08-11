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
import DownloadIcon from "@mui/icons-material/Download";
import enUS from 'date-fns/locale/en-US';
import './MenteeMeetings.css';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format: (date, formatString) => format(date, formatString, { locale: enUS }),
  parse: (dateString, formatString) => parse(dateString, formatString, new Date(), { locale: enUS }),
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1, locale: enUS }),
  getDay,
  locales,
});

function MenteeMeetings() {
  const navigate = useNavigate();

  // ---------------- MOCKS (no APIs) ----------------
  const MOCK_USER = JSON.parse(sessionStorage.getItem('user')) || {
    userId: 9999,
    menteekey: 9999,
    role: 'mentee',
    name: 'Mentee',
  };

  // Same homework mock used across pages
  const MOCK_HOMEWORK = [
    {
      homework_id: 101,
      title: "Arrays & Big-O",
      description: "Solve 5 array problems and write a short note on time complexity. Helpful ref: https://bigocheatsheet.io/",
      assigned_date: "2025-08-05T10:00:00Z",
      due_date: "2025-08-12T23:59:59Z",
    },
    {
      homework_id: 102,
      title: "SQL Joins Practice",
      description: "Complete the worksheet on INNER/LEFT/RIGHT joins using sample data. Try this sandbox: https://www.db-fiddle.com/",
      assigned_date: "2025-08-07T12:00:00Z",
      due_date: "2025-08-14T23:59:59Z",
    },
    {
      homework_id: 103,
      title: "React State & Props",
      description: "Build a small component demonstrating lifting state up and prop drilling. See docs: https://react.dev/",
      assigned_date: "2025-08-09T09:30:00Z",
      due_date: "2025-08-16T23:59:59Z",
    },
  ];

  const MOCK_MENTOR = {
    mentorkey: 2001,
    mentor_name: "Alex Mentor",
    // availability per weekday (Mon..Sun). times are 24h "HH:MM:SS"
    availability: {
      Monday:    [{ start_time: "09:00:00", end_time: "17:00:00" }],
      Tuesday:   [{ start_time: "09:00:00", end_time: "17:00:00" }],
      Wednesday: [{ start_time: "10:00:00", end_time: "16:00:00" }],
      Thursday:  [{ start_time: "09:00:00", end_time: "17:00:00" }],
      Friday:    [{ start_time: "09:00:00", end_time: "15:00:00" }],
      Saturday:  [],
      Sunday:    [],
    },
    blackoutDates: [
      // YYYY-MM-DD strings
      // e.g., "2025-08-15"
    ],
  };

  const MOCK_MEETINGS = [
    {
      meetingkey: "mtg_1",
      mentor_name: MOCK_MENTOR.mentor_name,
      datetime: "2025-08-11T10:00:00", // 1 hour assumed
      meeting_link: "https://zoom.us/j/123456789",
      meeting_password: "abc123",
      mentorkey: MOCK_MENTOR.mentorkey,
    },
    {
      meetingkey: "mtg_2",
      mentor_name: MOCK_MENTOR.mentor_name,
      datetime: "2025-08-12T14:00:00",
      meeting_link: "https://zoom.us/j/987654321",
      meeting_password: "xyz789",
      mentorkey: MOCK_MENTOR.mentorkey,
    },
  ];
  // -------------------------------------------------

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Export Calendar States
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  const userInfo = MOCK_USER;
  const menteeKey = userInfo?.menteekey;
  const user = MOCK_USER;
  const name = user['name'];
  const menteeName = name || "Mentee";

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.body.className = newTheme ? "dark-mode" : "";
    sessionStorage.setItem("isDarkMode", newTheme);
  };

  useEffect(() => {
    const savedTheme = sessionStorage.getItem("isDarkMode") === "true";
    setIsDarkMode(savedTheme);
    document.body.className = savedTheme ? "dark-mode" : "";
  }, []);

  // Helper: create 1-hour slots between "HH:MM:SS"
  const buildHourlySlots = (dateStr, startTime, endTime) => {
    const slots = [];
    let start = new Date(`${dateStr}T${startTime}`);
    const end = new Date(`${dateStr}T${endTime}`);
    while (start < end) {
      const next = new Date(start.getTime() + 60 * 60 * 1000);
      if (next <= end) {
        const pad = (n) => String(n).padStart(2, '0');
        const hh = pad(start.getHours());
        const mm = pad(start.getMinutes());
        const ss = pad(start.getSeconds());
        const nhh = pad(next.getHours());
        const nmm = pad(next.getMinutes());
        const nss = pad(next.getSeconds());
        slots.push({
          startTime: `${hh}:${mm}:${ss}`,
          endTime: `${nhh}:${nmm}:${nss}`,
        });
      }
      start = next;
    }
    return slots;
  };

  // Build initial events (meetings + homework)
  useEffect(() => {
    setMentor(MOCK_MENTOR);

    const mappedMeetings = MOCK_MEETINGS.map(meeting => ({
      title: `Meeting with ${meeting.mentor_name}`,
      start: new Date(meeting.datetime),
      end: new Date(new Date(meeting.datetime).getTime() + 60 * 60 * 1000),
      type: 'meeting',
      mentor_name: meeting.mentor_name,
      zoomLink: meeting.meeting_link,
      zoomPassword: meeting.meeting_password,
      meetingKey: meeting.meetingkey,
      mentorkey: meeting.mentorkey,
    }));

    const mappedHomework = MOCK_HOMEWORK.map(homework => ({
      title: `Homework: ${homework.title}`,
      start: new Date(homework.due_date),
      end: new Date(homework.due_date),
      type: 'homework',
      description: homework.description,
    }));

    setEvents([...mappedMeetings, ...mappedHomework]);
  }, []);

  // Compute availability (mock) for selected date
  useEffect(() => {
    if (!mentor || !selectedDate) return;

    // blackout check
    const isBlackout = (mentor.blackoutDates || []).some(d => d === selectedDate);
    if (isBlackout) {
      setAvailableTimeSlots([]);
      alert('Selected date is not available due to mentor blackout');
      return;
    }

    const dayOfWeek = new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' });
    const availForDay = mentor.availability[dayOfWeek] || [];

    // meetings on that date
    const meetingsOnDate = events.filter(
      e => e.type === 'meeting' && e.start.toDateString() === new Date(selectedDate).toDateString()
    );

    // Occupied 1-hr blocks
    const occupied = meetingsOnDate.map(m => {
      const pad = (n) => String(n).padStart(2, '0');
      const s = m.start;
      const e = m.end;
      return {
        startTime: `${pad(s.getHours())}:${pad(s.getMinutes())}:${pad(s.getSeconds())}`,
        endTime: `${pad(e.getHours())}:${pad(e.getMinutes())}:${pad(e.getSeconds())}`,
      };
    });

    // Subtract occupied from availability
    const availableRanges = [];
    availForDay.forEach(av => {
      let currStart = av.start_time;
      let currEnd = av.end_time;

      // sort occupied to subtract cleanly
      const occSorted = [...occupied].sort((a, b) => a.startTime.localeCompare(b.startTime));
      occSorted.forEach(occ => {
        if (occ.startTime >= currStart && occ.endTime <= currEnd) {
          if (occ.startTime > currStart) {
            availableRanges.push({ startTime: currStart, endTime: occ.startTime });
          }
          currStart = occ.endTime;
        }
      });
      if (currStart < currEnd) {
        availableRanges.push({ startTime: currStart, endTime: currEnd });
      }
    });

    // build 1h slots
    const slots = [];
    availableRanges.forEach(r => {
      slots.push(...buildHourlySlots(selectedDate, r.startTime, r.endTime));
    });
    setAvailableTimeSlots(slots);
  }, [mentor, selectedDate, events]);

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

  // Local schedule with conflict checks
  const handleScheduleMeeting = () => {
    if (!(selectedDate && selectedTimeSlot && mentor)) {
      alert('Please select a date and time slot.');
      return;
    }
    const start = new Date(`${selectedDate}T${selectedTimeSlot}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    // blackout
    if ((mentor.blackoutDates || []).includes(selectedDate)) {
      alert('Selected date is not available due to mentor blackout');
      return;
    }

    // within availability?
    const dayOfWeek = new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' });
    const availForDay = mentor.availability[dayOfWeek] || [];
    const inAvail = availForDay.some(av => {
      const s = new Date(`${selectedDate}T${av.start_time}`);
      const e = new Date(`${selectedDate}T${av.end_time}`);
      return start >= s && end <= e;
    });
    if (!inAvail) {
      alert('Selected time is outside mentor availability.');
      return;
    }

    // conflict with existing meetings?
    const conflict = events.some(e =>
      e.type === 'meeting' &&
      ((start >= e.start && start < e.end) || (end > e.start && end <= e.end) || (start <= e.start && end >= e.end))
    );
    if (conflict) {
      alert('Time conflict! Please select a different time.');
      return;
    }

    // Create new meeting event locally
    const newMeeting = {
      title: `Meeting with ${mentor.mentor_name}`,
      start,
      end,
      type: 'meeting',
      mentor_name: mentor.mentor_name,
      zoomLink: "https://zoom.us/j/newmock",
      zoomPassword: "mock123",
      meetingKey: `mtg_${Date.now()}`,
      mentorkey: mentor.mentorkey,
    };

    // Preserve homework events
    const homeworkEvents = events.filter(e => e.type === 'homework');
    const meetings = events.filter(e => e.type === 'meeting');
    setEvents([...meetings, newMeeting, ...homeworkEvents]);
    handleCloseScheduleDialog();
  };

  // Local reschedule with conflict check
  const handleRescheduleMeeting = () => {
    if (!selectedEvent || selectedEvent.type !== 'meeting') return;
    if (!(newDate && newTime)) {
      alert('Please select a new date and time.');
      return;
    }
    const start = new Date(`${newDate}T${newTime}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    // blackout
    if ((mentor?.blackoutDates || []).includes(newDate)) {
      alert('Selected date is not available due to mentor blackout');
      return;
    }

    // availability
    const dayOfWeek = new Date(newDate).toLocaleString('en-US', { weekday: 'long' });
    const availForDay = (mentor?.availability?.[dayOfWeek]) || [];
    const inAvail = availForDay.some(av => {
      const s = new Date(`${newDate}T${av.start_time}`);
      const e = new Date(`${newDate}T${av.end_time}`);
      return start >= s && end <= e;
    });
    if (!inAvail) {
      alert('Selected time is outside mentor availability.');
      return;
    }

    // conflict (excluding the selected event itself)
    const conflict = events.some(e =>
      e.type === 'meeting' &&
      e.meetingKey !== selectedEvent.meetingKey &&
      ((start >= e.start && start < e.end) || (end > e.start && end <= e.end) || (start <= e.start && end >= e.end))
    );
    if (conflict) {
      alert('Time conflict! Please select a different time.');
      return;
    }

    setEvents(events.map(event =>
      event.meetingKey === selectedEvent.meetingKey
        ? { ...event, start, end }
        : event
    ));
    setSelectedEvent(null);
    setNewDate('');
    setNewTime('');
  };

  // Export Calendar (client-side ICS)
  const handleOpenExportDialog = () => {
    setShowExportDialog(true);
    setExportStartDate("");
    setExportEndDate("");
  };

  const handleCloseExportDialog = () => {
    setShowExportDialog(false);
  };

  const handleExportCalendar = () => {
    if (!exportStartDate || !exportEndDate) {
      alert("Please select both start and end dates.");
      return;
    }
    if (exportEndDate < exportStartDate) {
      alert("End date must be after start date.");
      return;
    }

    const inRange = events.filter(e => {
      const d = e.start.toISOString().slice(0,10);
      return d >= exportStartDate && d <= exportEndDate && e.type === 'meeting';
    });

    const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const toICSDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MentorApp//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;
    inRange.forEach(evt => {
      ics += `BEGIN:VEVENT
UID:${evt.meetingKey || (Math.random().toString(36).slice(2))}@mentorapp
DTSTAMP:${dtstamp}
DTSTART:${toICSDate(evt.start)}
DTEND:${toICSDate(evt.end)}
SUMMARY:${evt.title}
DESCRIPTION:Zoom Link: ${evt.zoomLink || ''}\\nPassword: ${evt.zoomPassword || ''}
END:VEVENT
`;
    });
    ics += `END:VCALENDAR`;

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meetings.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    handleCloseExportDialog();
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
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/todo-progression")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={write} alt="write" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/check-hw")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={assign} alt="assign" />
          </motion.button>
          <motion.button
            className="icon1"
            onClick={() => navigate("/mentee-meetings")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={calendar} alt="calendar" />
          </motion.button>
        </div>

        <div className="slider-section">
          <label className="slider-container">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
        <motion.button
          className="logout-buttonV2"
          onClick={handleLogout}
          whileHover={{ scale: 1.1 }}
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
                <Box display="flex" justifyContent="center" gap={2} mb={2} width="100%">
                  <Button variant="contained" color="primary" onClick={handleOpenScheduleDialog}>
                    Schedule New Meeting
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<DownloadIcon />}
                    onClick={handleOpenExportDialog}
                  >
                    Export Calendar
                  </Button>
                </Box>

                <div>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, marginTop: '20px', color: 'black' }}
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
                          <Typography>Zoom Link: <Link href={selectedEvent.zoomLink} target="_blank" rel="noopener noreferrer">{selectedEvent.zoomLink}</Link></Typography>
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

                {/* Export Calendar Dialog */}
                <Dialog
                  open={showExportDialog}
                  onClose={handleCloseExportDialog}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle>Export Calendar</DialogTitle>
                  <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={2}>
                      <TextField
                        type="date"
                        value={exportStartDate}
                        onChange={(e) => setExportStartDate(e.target.value)}
                        label="Start Date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                      <TextField
                        type="date"
                        value={exportEndDate}
                        onChange={(e) => setExportEndDate(e.target.value)}
                        label="End Date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleExportCalendar}
                      variant="contained"
                      color="primary"
                      startIcon={<DownloadIcon />}
                    >
                      Export
                    </Button>
                    <Button
                      onClick={handleCloseExportDialog}
                      variant="outlined"
                      color="secondary"
                    >
                      Cancel
                    </Button>
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
