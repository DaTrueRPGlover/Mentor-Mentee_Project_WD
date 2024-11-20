import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import logo from "../assets/WDC.png";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
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
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState('');
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
        console.error("Error fetching mentees:", error);
      }
    };

    const fetchMeetings = async () => {
      try {
        const mentorinfo = JSON.parse(localStorage.getItem("user"));
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
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMentees();
    fetchMeetings();
  }, [mentorkey]);

  const handleSelectMeeting = (event) => {
    setSelectedMeeting(event);
    setNewDate('');
    setNewTime('');
  };

  const handleClosePopup = () => {
    setSelectedMeeting(null);
    setNewDate('');
    setNewTime('');
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

  const handleOpenScheduleDialog = () => {
    setShowScheduleDialog(true);
    setSelectedMentee('');
    setNewDate('');
    setNewTime('');
    setZoomLink('');
    setZoomPassword('');
  };

  const handleCloseScheduleDialog = () => {
    setShowScheduleDialog(false);
  };

  const handleScheduleMeeting = async () => {
    if (
      selectedMentee &&
      newDate.trim() &&
      newTime.trim() &&
      zoomLink.trim() &&
      zoomPassword.trim()
    ) {
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
          handleCloseScheduleDialog();
        } else if (response.status === 409) {
          alert("Time conflict! Please select a different time.");
        }
      } catch (error) {
        console.error("Error scheduling meeting:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <img src={logo} alt="Logo" style={{ height: 40, marginRight: 16 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mentor Meetings
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Schedule Mentee Meetings
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenScheduleDialog}
          sx={{ mb: 2 }}
        >
          Schedule New Meeting
        </Button>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Calendar
                localizer={localizer}
                events={meetings}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectEvent={handleSelectMeeting}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
      {selectedMeeting && (
        <Dialog open={Boolean(selectedMeeting)} onClose={handleClosePopup} maxWidth="sm" fullWidth>
          <DialogTitle>Meeting Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              <strong>Mentee:</strong> {selectedMeeting.mentee_name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Zoom Link:</strong> {selectedMeeting.zoomLink}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Password:</strong> {selectedMeeting.zoomPassword}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Date:</strong> {selectedMeeting.start.toDateString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Time:</strong> {selectedMeeting.start.toLocaleTimeString()}
            </Typography>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRescheduleMeeting} variant="contained" color="primary">
              Reschedule
            </Button>
            <Button onClick={handleClosePopup} variant="outlined" color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog open={showScheduleDialog} onClose={handleCloseScheduleDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule New Meeting</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Select
              value={selectedMentee}
              onChange={(e) => setSelectedMentee(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>Select a Mentee</MenuItem>
              {mentees.map(mentee => (
                <MenuItem key={mentee.menteekey} value={mentee.menteekey}>
                  {mentee.mentee_name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              label="Date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              label="Time"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              value={zoomLink}
              onChange={(e) => setZoomLink(e.target.value)}
              label="Zoom Link"
            />
            <TextField
              value={zoomPassword}
              onChange={(e) => setZoomPassword(e.target.value)}
              label="Zoom Password"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleScheduleMeeting} variant="contained" color="primary">
            Schedule
          </Button>
          <Button onClick={handleCloseScheduleDialog} variant="outlined" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MentorMeetings;
