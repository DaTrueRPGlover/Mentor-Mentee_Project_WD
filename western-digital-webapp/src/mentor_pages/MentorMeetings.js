// MentorMeetings.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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

function MentorMeetings() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [blackoutDate, setBlackoutDate] = useState("");
  const [blackoutReason, setBlackoutReason] = useState("");
  const [showAddBlackoutDialog, setShowAddBlackoutDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const mentorinfo = JSON.parse(sessionStorage.getItem("user"));

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const fetchMeetings = async () => {
        try {
          const mentorkey = mentorinfo.mentorkey;
          const response = await fetch(
            `http://localhost:3001/api/meetings/meetings?userId=${mentorkey}`
          );
          const data = await response.json();
          const mappedMeetings = data.map((meeting) => ({
            title: `Meeting with ${meeting.mentee_name}`,
            start: new Date(meeting.datetime),
            end: new Date(
              new Date(meeting.datetime).getTime() + 60 * 60 * 1000
            ),
            mentee_name: meeting.mentee_name,
            meetingKey: meeting.meetingkey,
            type: "meeting",
          }));
          setEvents(mappedMeetings);
        } catch (error) {
          console.error("Error fetching meetings:", error);
        }
      };

      const fetchAvailability = async () => {
        try {
          const mentorkey = mentorinfo.mentorkey;
          const response = await fetch(
            `http://localhost:3001/api/mentor/${mentorkey}/availability`
          );
          const data = await response.json();
          setAvailability(data);
        } catch (error) {
          console.error("Error fetching availability:", error);
        }
      };

      const fetchBlackoutDates = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/mentor/${mentorinfo.mentorkey}/blackout-dates`
          );
          const data = await response.json();
          const blackoutEvents = data.map((bd) => ({
            title: "Blackout Date",
            start: new Date(bd.date),
            end: new Date(bd.date),
            allDay: true,
            reason: bd.reason,
            type: "blackout",
            date: bd.date, // Added date property for easy comparison
          }));
          setEvents((prev) => [
            ...prev.filter((event) => event.type !== "blackout"),
            ...blackoutEvents,
          ]);
        } catch (error) {
          console.error("Error fetching blackout dates:", error);
        }
      };

      await fetchMeetings();
      await fetchAvailability();
      await fetchBlackoutDates();
    };

    fetchData();
  }, [mentorinfo.mentorkey]);

  const handleOpenAddBlackoutDialog = () => {
    setShowAddBlackoutDialog(true);
    setBlackoutDate("");
    setBlackoutReason("");
  };

  const handleCloseAddBlackoutDialog = () => {
    setShowAddBlackoutDialog(false);
  };

  const handleAddBlackoutDate = async () => {
    if (blackoutDate && blackoutReason) {
      // Check if the date already has a blackout date
      const existingBlackout = events.find(
        (event) =>
          event.type === "blackout" &&
          event.start.toDateString() === new Date(blackoutDate).toDateString()
      );
      if (existingBlackout) {
        alert("A blackout date already exists for the selected date.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3001/api/mentor/${mentorinfo.mentorkey}/blackout-dates`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              date: blackoutDate,
              reason: blackoutReason,
            }),
          }
        );
        if (response.ok) {
          setEvents((prev) => [
            ...prev,
            {
              title: "Blackout Date",
              start: new Date(blackoutDate),
              end: new Date(blackoutDate),
              allDay: true,
              reason: blackoutReason,
              type: "blackout",
              date: blackoutDate,
            },
          ]);
          handleCloseAddBlackoutDialog();
        } else {
          alert("Failed to add blackout date");
        }
      } catch (error) {
        console.error("Error adding blackout date:", error);
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewDate("");
    setNewTime("");
  };

  const handleCloseEventDialog = () => {
    setSelectedEvent(null);
    setNewDate("");
    setNewTime("");
  };

  const handleRescheduleMeeting = async () => {
    const newDateTime = `${newDate}T${newTime}`;
    try {
      const response = await fetch(
        "http://localhost:3001/api/meetings/reschedule",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meetingKey: selectedEvent.meetingKey,
            newDateTime,
          }),
        }
      );

      if (response.status === 409) {
        alert("Time conflict! Please select a different time.");
      } else if (response.ok) {
        setEvents(
          events.map((event) =>
            event.meetingKey === selectedEvent.meetingKey
              ? {
                  ...event,
                  start: new Date(newDateTime),
                  end: new Date(
                    new Date(newDateTime).getTime() + 60 * 60 * 1000
                  ),
                }
              : event
          )
        );
        handleCloseEventDialog();
      } else {
        const data = await response.json();
        alert(data.message || "Error rescheduling meeting.");
      }
    } catch (error) {
      console.error("Error rescheduling meeting:", error);
    }
  };

  const handleDeleteBlackoutDate = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/mentor/${mentorinfo.mentorkey}/blackout-dates`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: selectedEvent.date,
          }),
        }
      );
      if (response.ok) {
        setEvents(
          events.filter(
            (event) =>
              !(event.type === "blackout" && event.date === selectedEvent.date)
          )
        );
        handleCloseEventDialog();
      } else {
        alert("Failed to delete blackout date");
      }
    } catch (error) {
      console.error("Error deleting blackout date:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const getAvailabilityByDay = (day) => {
    return availability
      .filter((avail) => avail.day_of_week === day)
      .map((avail) => `${avail.start_time} - ${avail.end_time}`)
      .join(", ");
  };

  return (
    <div>
<AppBar position="static" color="primary">
  <Toolbar sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
    <Button
      className="logo-button"
      onClick={() => navigate("/mentor-home")}
      sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        left: 16, 
      }}
    >
      <img src={logo} alt="Logo" style={{ height: 40 }} />
    </Button>

    <Typography 
      variant="h6" 
      sx={{ 
        flexGrow: 1, 
        textAlign: 'center', 
      }}
    >
      Mentor Meetings
    </Typography>

  
    <Button
      color="inherit"
      onClick={handleLogout}
      sx={{
        position: 'absolute',
        right: 16,
      }}
    >
      Logout
    </Button>
  </Toolbar>
</AppBar>


      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Manage Your Availability
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                {daysOfWeek.map((day, index) => (
                  <TableCell key={index} align="center">
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {daysOfWeek.map((day, index) => (
                  <TableCell key={index}>
                    {getAvailabilityByDay(day) || "No Availability"}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h4" align="center" gutterBottom>
          Your Scheduled Meetings
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddBlackoutDialog}
          sx={{ mb: 2 }}
        >
          Add Blackout Date
        </Button>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={handleSelectEvent}
        />
      </Container>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog
          open={Boolean(selectedEvent)}
          onClose={handleCloseEventDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedEvent.type === "meeting"
              ? "Meeting Details"
              : "Blackout Date"}
          </DialogTitle>
          <DialogContent>
            {selectedEvent.type === "meeting" ? (
              <>
                <Typography variant="body1" gutterBottom>
                  <strong>Mentee:</strong> {selectedEvent.mentee_name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Date:</strong> {selectedEvent.start.toDateString()}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Time:</strong>{" "}
                  {selectedEvent.start.toLocaleTimeString()} -{" "}
                  {selectedEvent.end.toLocaleTimeString()}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Reschedule Meeting
                </Typography>
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
                <Typography variant="body1" gutterBottom>
                  <strong>Date:</strong> {selectedEvent.start.toDateString()}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Reason:</strong> {selectedEvent.reason}
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            {selectedEvent.type === "meeting" ? (
              <>
                <Button
                  onClick={handleRescheduleMeeting}
                  variant="contained"
                  color="primary"
                >
                  Reschedule
                </Button>
                <Button
                  onClick={handleCloseEventDialog}
                  variant="outlined"
                  color="secondary"
                >
                  Close
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleDeleteBlackoutDate}
                  variant="contained"
                  color="secondary"
                >
                  Remove Blackout Date
                </Button>
                <Button
                  onClick={handleCloseEventDialog}
                  variant="outlined"
                  color="primary"
                >
                  Close
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      )}

      {/* Add Blackout Date Dialog */}
      <Dialog
        open={showAddBlackoutDialog}
        onClose={handleCloseAddBlackoutDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Blackout Date</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              type="date"
              value={blackoutDate}
              onChange={(e) => setBlackoutDate(e.target.value)}
              label="Date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              value={blackoutReason}
              onChange={(e) => setBlackoutReason(e.target.value)}
              label="Reason"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddBlackoutDate}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
          <Button
            onClick={handleCloseAddBlackoutDialog}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MentorMeetings;
