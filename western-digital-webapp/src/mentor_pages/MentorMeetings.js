import "./MentorMeetings.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Typography,
  Box,
  FormControl,
  InputLabel,
  DialogContentText,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { motion } from "framer-motion";
import "react-big-calendar/lib/css/react-big-calendar.css";

import logo from "../assets/WDC2.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import hw from "../assets/hw.png";
import calendarImg from "../assets/calendar.png";
import logout from "../assets/logout.png";

import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MentorMeetings = () => {
  const navigate = useNavigate();

  // State
  const [events, setEvents] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dialog states
  const [openAddAvailabilityDialog, setOpenAddAvailabilityDialog] =
    useState(false);
  const [openAddBlackoutDialog, setOpenAddBlackoutDialog] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [blackoutDate, setBlackoutDate] = useState("");
  const [blackoutReason, setBlackoutReason] = useState("");
  const [showEditAvailabilityDialog, setShowEditAvailabilityDialog] =
    useState(false);
  const [editDay, setEditDay] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  // Dummy data init
  useEffect(() => {
    const dummyMeetings = [
      {
        title: "Meeting with John Doe",
        start: new Date("2025-08-10T10:00:00"),
        end: new Date("2025-08-10T11:00:00"),
        mentee_name: "John Doe",
        meetingKey: "mtg1",
        type: "meeting",
      },
      {
        title: "Meeting with Jane Smith",
        start: new Date("2025-08-11T14:00:00"),
        end: new Date("2025-08-11T15:00:00"),
        mentee_name: "Jane Smith",
        meetingKey: "mtg2",
        type: "meeting",
      },
    ];

    const dummyBlackouts = [
      {
        title: "Blackout Date",
        start: new Date("2025-08-12"),
        end: new Date("2025-08-13"),
        allDay: true,
        reason: "Vacation",
        type: "blackout",
        date: "2025-08-12",
      },
    ];

    const dummyAvailability = [
      { day_of_week: "Monday", start_time: "09:00", end_time: "12:00" },
      { day_of_week: "Wednesday", start_time: "13:00", end_time: "16:00" },
      { day_of_week: "Friday", start_time: "10:00", end_time: "11:30" },
    ];

    setEvents([...dummyMeetings, ...dummyBlackouts]);
    setAvailability(dummyAvailability);
  }, []);

  // Toggle theme
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Navigation and logout
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  // Availability helpers
  const getAvailabilityByDay = (day) => {
    const slots = availability.filter((a) => a.day_of_week === day);
    if (slots.length === 0) return "No availability";
    return slots.map((slot, i) => (
      <div key={i}>
        {slot.start_time} - {slot.end_time}
      </div>
    ));
  };

  // Dialog handlers
  const handleOpenAddAvailabilityDialog = () =>
    setOpenAddAvailabilityDialog(true);
  const handleCloseAddAvailabilityDialog = () =>
    setOpenAddAvailabilityDialog(false);

  const handleOpenAddBlackoutDialog = () => setOpenAddBlackoutDialog(true);
  const handleCloseAddBlackoutDialog = () => setOpenAddBlackoutDialog(false);

  const handleOpenExportDialog = () => setShowExportDialog(true);
  const handleCloseExportDialog = () => setShowExportDialog(false);

  const handleOpenEditAvailabilityDialog = (day) => {
    const avail = availability.find((a) => a.day_of_week === day);
    if (!avail) return alert("No availability to edit on this day");
    setEditDay(avail.day_of_week);
    setEditStartTime(avail.start_time);
    setEditEndTime(avail.end_time);
    setShowEditAvailabilityDialog(true);
  };
  const handleCloseEditAvailabilityDialog = () =>
    setShowEditAvailabilityDialog(false);

  // Add availability
  const handleAddAvailability = () => {
    if (selectedDay && startTime && endTime) {
      setAvailability((prev) => [
        ...prev,
        {
          day_of_week: selectedDay,
          start_time: startTime,
          end_time: endTime,
        },
      ]);
      setSelectedDay("");
      setStartTime("");
      setEndTime("");
      handleCloseAddAvailabilityDialog();
    } else {
      alert("Please fill in all fields");
    }
  };

  // Edit availability update
  const handleEditAvailability = () => {
    if (editDay && editStartTime && editEndTime) {
      setAvailability((prev) =>
        prev.map((a) =>
          a.day_of_week === editDay
            ? {
                day_of_week: editDay,
                start_time: editStartTime,
                end_time: editEndTime,
              }
            : a
        )
      );
      handleCloseEditAvailabilityDialog();
    } else {
      alert("Please fill in all fields");
    }
  };

  // Blackout date add (dummy add)
  const handleAddBlackoutDate = () => {
    if (blackoutDate && blackoutReason) {
      const newBlackout = {
        title: "Blackout Date",
        start: new Date(blackoutDate),
        end: new Date(blackoutDate),
        allDay: true,
        reason: blackoutReason,
        type: "blackout",
        date: blackoutDate,
      };
      setEvents((prev) => [...prev, newBlackout]);
      setBlackoutDate("");
      setBlackoutReason("");
      handleCloseAddBlackoutDialog();
    } else {
      alert("Please fill in all fields");
    }
  };

  // Event selection on calendar
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewDate(event.start.toISOString().split("T")[0]);
    setNewTime(event.start.toTimeString().substring(0, 5));
  };

  // Close event dialog
  const handleCloseEventDialog = () => {
    setSelectedEvent(null);
    setNewDate("");
    setNewTime("");
  };

  // Cancel meeting confirmation dialog handlers
  const handleCancelMeeting = () => setShowCancelConfirmation(true);
  const confirmCancelMeeting = () => {
    if (!selectedEvent) return;
    setEvents((prev) => prev.filter((ev) => ev !== selectedEvent));
    setShowCancelConfirmation(false);
    handleCloseEventDialog();
  };
  const cancelCancelMeeting = () => setShowCancelConfirmation(false);

  // Remove blackout date
  const handleDeleteBlackoutDate = () => {
    if (!selectedEvent) return;
    setEvents((prev) => prev.filter((ev) => ev !== selectedEvent));
    handleCloseEventDialog();
  };

  // Reschedule meeting (dummy: just update date/time locally)
  const handleRescheduleMeeting = () => {
    if (!newDate || !newTime || !selectedEvent) {
      alert("Please enter a new date and time");
      return;
    }
    const updatedStart = new Date(`${newDate}T${newTime}:00`);
    const updatedEnd = new Date(
      updatedStart.getTime() + (selectedEvent.end - selectedEvent.start)
    );
    setEvents((prev) =>
      prev.map((ev) =>
        ev === selectedEvent
          ? { ...ev, start: updatedStart, end: updatedEnd }
          : ev
      )
    );
    handleCloseEventDialog();
  };

  // Dummy export calendar handler (just close dialog)
  const handleExportCalendar = () => {
    alert(
      `Export calendar from ${exportStartDate} to ${exportEndDate} (dummy)`
    );
    handleCloseExportDialog();
  };

  return (
    <div className="mentor-meetings">
      <div className="logo-title-container">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="title-header">Meetings</h1>
      </div>

      <div className="sidebarA">
        {/* Navigation Buttons */}
        <div className="nav-buttonsA">
          <motion.button
            className="icon"
            onClick={() => navigate("/interact-with-mentee")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/write-mentee-progression")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={write} alt="write" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/assign-homework")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={hw} alt="create" />
          </motion.button>
          <motion.button
            className="icon1"
            onClick={() => navigate("/mentor-meetings")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={calendarImg} alt="calendar" />
          </motion.button>
        </div>

        {/* Theme Toggle */}
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

        {/* Logout Button */}
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
                <Typography
                  style={{ color: "black" }}
                  variant="h4"
                  align="center"
                  gutterBottom
                >
                  Manage Your Availability
                </Typography>

                {/* Add Availability and Add Blackout Date Buttons */}
                <Box display="flex" justifyContent="center" mb={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddAvailabilityDialog}
                  >
                    Add Availability
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenAddBlackoutDialog}
                    sx={{ ml: 2 }}
                  >
                    Add Blackout Date
                  </Button>
                </Box>

                {/* Availability Table */}
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
                            {getAvailabilityByDay(day)}
                            <Button
                              size="small"
                              onClick={() =>
                                handleOpenEditAvailabilityDialog(day)
                              }
                              sx={{ mt: 1 }}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography
                  style={{ color: "black" }}
                  variant="h4"
                  align="center"
                  gutterBottom
                >
                  Your Scheduled Meetings
                </Typography>

                {/* Export Calendar Button */}
                <Box display="flex" justifyContent="center" mb={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<DownloadIcon />}
                    onClick={handleOpenExportDialog}
                    sx={{ mb: 2 }}
                  >
                    Export Calendar
                  </Button>
                </Box>

                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500, color: "black" }}
                  onSelectEvent={handleSelectEvent}
                />

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
                            <strong>Date:</strong>{" "}
                            {selectedEvent.start.toDateString()}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>Time:</strong>{" "}
                            {selectedEvent.start.toLocaleTimeString()} -{" "}
                            {selectedEvent.end.toLocaleTimeString()}
                          </Typography>
                          <Typography variant="h6" gutterBottom>
                            Reschedule Meeting
                          </Typography>
                          <Box
                            display="flex"
                            flexDirection="column"
                            gap={2}
                            mt={2}
                          >
                            <TextField
                              type="date"
                              value={newDate}
                              onChange={(e) => setNewDate(e.target.value)}
                              label="New Date"
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                            />
                            <TextField
                              type="time"
                              value={newTime}
                              onChange={(e) => setNewTime(e.target.value)}
                              label="New Time"
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                            />
                          </Box>
                        </>
                      ) : (
                        <>
                          <Typography variant="body1" gutterBottom>
                            <strong>Date:</strong>{" "}
                            {selectedEvent.start.toDateString()}
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
                            onClick={handleCancelMeeting}
                            variant="contained"
                            color="secondary"
                          >
                            Cancel Meeting
                          </Button>
                          <Button
                            onClick={handleCloseEventDialog}
                            variant="outlined"
                            color="primary"
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

                {/* Cancel Meeting Confirmation Dialog */}
                <Dialog
                  open={showCancelConfirmation}
                  onClose={cancelCancelMeeting}
                  maxWidth="xs"
                  fullWidth
                >
                  <DialogTitle>Confirm Cancellation</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to cancel this meeting?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={confirmCancelMeeting}
                      variant="contained"
                      color="secondary"
                    >
                      Yes, Cancel
                    </Button>
                    <Button
                      onClick={cancelCancelMeeting}
                      variant="outlined"
                      color="primary"
                    >
                      No
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Add Blackout Date Dialog */}
                <Dialog
                  open={openAddBlackoutDialog}
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
                        fullWidth
                      />
                      <TextField
                        value={blackoutReason}
                        onChange={(e) => setBlackoutReason(e.target.value)}
                        label="Reason"
                        fullWidth
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

                {/* Add Availability Dialog */}
                <Dialog
                  open={openAddAvailabilityDialog}
                  onClose={handleCloseAddAvailabilityDialog}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle>Add Availability</DialogTitle>
                  <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={2}>
                      <FormControl fullWidth>
                        <InputLabel id="select-day-label">
                          Day of the Week
                        </InputLabel>
                        <Select
                          labelId="select-day-label"
                          value={selectedDay}
                          label="Day of the Week"
                          onChange={(e) => setSelectedDay(e.target.value)}
                        >
                          {daysOfWeek.map((day) => (
                            <MenuItem key={day} value={day}>
                              {day}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        label="Start Time"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                        fullWidth
                      />
                      <TextField
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        label="End Time"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                        fullWidth
                      />
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleAddAvailability}
                      variant="contained"
                      color="primary"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleCloseAddAvailabilityDialog}
                      variant="outlined"
                      color="secondary"
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Edit Availability Dialog */}
                <Dialog
                  open={showEditAvailabilityDialog}
                  onClose={handleCloseEditAvailabilityDialog}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle>Edit Availability</DialogTitle>
                  <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={2}>
                      <FormControl fullWidth>
                        <InputLabel id="edit-select-day-label">
                          Day of the Week
                        </InputLabel>
                        <Select
                          labelId="edit-select-day-label"
                          value={editDay}
                          label="Day of the Week"
                          onChange={(e) => setEditDay(e.target.value)}
                        >
                          {daysOfWeek.map((day) => (
                            <MenuItem key={day} value={day}>
                              {day}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        type="time"
                        value={editStartTime}
                        onChange={(e) => setEditStartTime(e.target.value)}
                        label="Start Time"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                        fullWidth
                      />
                      <TextField
                        type="time"
                        value={editEndTime}
                        onChange={(e) => setEditEndTime(e.target.value)}
                        label="End Time"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                        fullWidth
                      />
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleEditAvailability}
                      variant="contained"
                      color="primary"
                    >
                      Update
                    </Button>
                    <Button
                      onClick={handleCloseEditAvailabilityDialog}
                      variant="outlined"
                      color="secondary"
                    >
                      Cancel
                    </Button>
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
};

export default MentorMeetings;

// import './MentorMeetings.css';
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// import { format, parse, startOfWeek, getDay } from "date-fns";
// import {
//   Typography,
//   Button,
//   Container,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Box,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   DialogContentText,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import DownloadIcon from "@mui/icons-material/Download";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { motion } from "framer-motion";
// import logo from "../assets/WDC2.png";
// import chat from "../assets/chat.png";
// import hw from "../assets/hw.png";
// import write from "../assets/write.png";
// import assign from "../assets/assign.png";
// import calendarImg from "../assets/calendar.png";
// import logout from "../assets/logout.png";

// const locales = {
//   "en-US": require("date-fns/locale/en-US"),
// };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
//   getDay,
//   locales,
// });

// function MentorMeetings() {
//   const navigate = useNavigate();
//   const [events, setEvents] = useState([]);
//   const [availability, setAvailability] = useState([]);
//   const [blackoutDate, setBlackoutDate] = useState("");
//   const [blackoutReason, setBlackoutReason] = useState("");
//   const [showAddBlackoutDialog, setShowAddBlackoutDialog] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [newDate, setNewDate] = useState("");
//   const [newTime, setNewTime] = useState("");
//   const mentorinfo = JSON.parse(sessionStorage.getItem("user"));
//   const user = JSON.parse(sessionStorage.getItem("user"));
//   const name = user['name'];
//   const adminName = name || "Admin";
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   // State variables for Availability Management
//   const [showAddAvailabilityDialog, setShowAddAvailabilityDialog] = useState(false);
//   const [showEditAvailabilityDialog, setShowEditAvailabilityDialog] = useState(false);
//   const [selectedDay, setSelectedDay] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [availabilityToEdit, setAvailabilityToEdit] = useState(null);
//   const [editDay, setEditDay] = useState("");
//   const [editStartTime, setEditStartTime] = useState("");
//   const [editEndTime, setEditEndTime] = useState("");

//   // State variables for Export Calendar
//   const [showExportDialog, setShowExportDialog] = useState(false);
//   const [exportStartDate, setExportStartDate] = useState("");
//   const [exportEndDate, setExportEndDate] = useState("");

//   // State variables for Cancel Meeting Confirmation
//   const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

//   const daysOfWeek = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ];

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//     document.body.className = isDarkMode ? "" : "dark-mode";
//   };

//   const handleLogout = () => {
//     sessionStorage.clear();
//     navigate("/");
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const fetchMeetings = async () => {
//         try {
//           const mentorkey = mentorinfo.mentorkey;
//           const response = await fetch(
//             `http://localhost:3001/api/meetings/meetings?userId=${mentorkey}`
//           );
//           const data = await response.json();
//           const mappedMeetings = data.map((meeting) => ({
//             title: `Meeting with ${meeting.mentee_name}`,
//             start: new Date(meeting.datetime),
//             end: new Date(
//               new Date(meeting.datetime).getTime() + 60 * 60 * 1000
//             ),
//             mentee_name: meeting.mentee_name,
//             meetingKey: meeting.meetingkey,
//             type: "meeting",
//           }));
//           setEvents(mappedMeetings);
//         } catch (error) {
//           console.error("Error fetching meetings:", error);
//         }
//       };

//       const fetchAvailability = async () => {
//         try {
//           const mentorkey = mentorinfo.mentorkey;
//           const response = await fetch(
//             `http://localhost:3001/api/mentor/${mentorkey}/availability`
//           );
//           const data = await response.json();
//           setAvailability(data);
//         } catch (error) {
//           console.error("Error fetching availability:", error);
//         }
//       };

//       const fetchBlackoutDates = async () => {
//         try {
//           const response = await fetch(
//             `http://localhost:3001/api/mentor/${mentorinfo.mentorkey}/blackout-dates`
//           );
//           const data = await response.json();
//           const blackoutEvents = data.map(bd => {
//             const [year, month, day] = bd.date.split('-').map(Number);
//             const date = new Date(year, month - 1, day);
//             return {
//               title: 'Blackout Date',
//               start: date,
//               end: new Date(year, month - 1, day + 1), // Ensuring the event spans at least one full day
//               allDay: true,
//               reason: bd.reason,
//               type: 'blackout',
//               date: bd.date,
//             };
//           });
//           setEvents(prev => [...prev.filter(event => event.type !== 'blackout'), ...blackoutEvents]);
//         } catch (error) {
//           console.error("Error fetching blackout dates:", error);
//         }
//       };

//       await fetchMeetings();
//       await fetchAvailability();
//       await fetchBlackoutDates();
//     };

//     fetchData();
//   }, [mentorinfo.mentorkey]);

//   // Function to check if the new availability overlaps with existing availability
//   const hasOverlappingAvailability = (day, newStart, newEnd, excludeSlot = null) => {
//     const dayAvailabilities = availability.filter(avail => avail.day_of_week === day);
//     for (const avail of dayAvailabilities) {
//       if (excludeSlot && avail.start_time === excludeSlot.start_time && avail.end_time === excludeSlot.end_time) {
//         continue; // Skip the slot being edited
//       }
//       // Check for overlap
//       if (
//         (newStart < avail.end_time) &&
//         (newEnd > avail.start_time)
//       ) {
//         return true;
//       }
//     }
//     return false;
//   };

//   // Blackout Date Handlers
//   const handleOpenAddBlackoutDialog = () => {
//     setShowAddBlackoutDialog(true);
//     setBlackoutDate("");
//     setBlackoutReason("");
//   };

//   const handleCloseAddBlackoutDialog = () => {
//     setShowAddBlackoutDialog(false);
//   };

//   const handleAddBlackoutDate = async () => {
//     if (blackoutDate && blackoutReason) {
//       const existingBlackout = events.find(event =>
//         event.type === 'blackout' &&
//         event.start.toDateString() === new Date(blackoutDate).toDateString()
//       );
//       if (existingBlackout) {
//         alert("A blackout date already exists for the selected date.");
//         return;
//       }

//       try {
//         const response = await fetch(
//           `http://localhost:3001/api/mentor/${mentorinfo.mentorkey}/blackout-dates`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               date: blackoutDate,
//               reason: blackoutReason,
//             }),
//           }
//         );
//         if (response.ok) {
//           const [year, month, day] = blackoutDate.split('-').map(Number);
//           const date = new Date(year, month - 1, day);
//           setEvents(prev => [
//             ...prev,
//             {
//               title: 'Blackout Date',
//               start: date,
//               end: new Date(year, month - 1, day + 1),
//               allDay: true,
//               reason: blackoutReason,
//               type: "blackout",
//               date: blackoutDate,
//             },
//           ]);
//           handleCloseAddBlackoutDialog();
//         } else {
//           const data = await response.json();
//           alert(data.message || "Failed to add blackout date");
//         }
//       } catch (error) {
//         console.error("Error adding blackout date:", error);
//       }
//     } else {
//       alert("Please fill in all fields");
//     }
//   };

//   const handleDeleteBlackoutDate = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:3001/api/mentor/${mentorinfo.mentorkey}/blackout-dates`,
//         {
//           method: "DELETE",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             date: selectedEvent.date,
//           }),
//         }
//       );
//       if (response.ok) {
//         setEvents(
//           events.filter(
//             (event) =>
//               !(event.type === "blackout" && event.date === selectedEvent.date)
//           )
//         );
//         handleCloseEventDialog();
//       } else {
//         const data = await response.json();
//         alert(data.message || "Failed to delete blackout date");
//       }
//     } catch (error) {
//       console.error("Error deleting blackout date:", error);
//     }
//   };

//   // Availability Handlers
//   const handleOpenAddAvailabilityDialog = () => {
//     setShowAddAvailabilityDialog(true);
//     setSelectedDay("");
//     setStartTime("");
//     setEndTime("");
//   };

//   const handleCloseAddAvailabilityDialog = () => {
//     setShowAddAvailabilityDialog(false);
//   };

//   const handleAddAvailability = async () => {
//     if (selectedDay && startTime && endTime) {
//       if (endTime <= startTime) {
//         alert("End time must be after start time.");
//         return;
//       }

//       if (hasOverlappingAvailability(selectedDay, startTime, endTime)) {
//         alert("The new availability time overlaps with existing availability.");
//         return;
//       }

//       try {
//         const response = await fetch(
//           `http://localhost:3001/api/mentor/${mentorinfo.mentorkey}/availability`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               dayOfWeek: selectedDay,
//               startTime,
//               endTime,
//             }),
//           }
//         );
//         if (response.ok) {
//           // Refresh availability
//           await fetchAvailability();
//           handleCloseAddAvailabilityDialog();
//         } else {
//           const data = await response.json();
//           alert(data.message || "Failed to add availability");
//         }
//       } catch (error) {
//         console.error("Error adding availability:", error);
//       }
//     } else {
//       alert("Please fill in all fields");
//     }
//   };

//   const fetchAvailability = async () => {
//     try {
//       const mentorkey = mentorinfo.mentorkey;
//       const response = await fetch(
//         `http://localhost:3001/api/mentor/${mentorkey}/availability`
//       );
//       const data = await response.json();
//       setAvailability(data);
//     } catch (error) {
//       console.error("Error fetching availability:", error);
//     }
//   };

//   const handleOpenEditAvailabilityDialog = (availabilitySlot) => {
//     setAvailabilityToEdit(availabilitySlot);
//     setEditDay(availabilitySlot.day_of_week);
//     setEditStartTime(availabilitySlot.start_time);
//     setEditEndTime(availabilitySlot.end_time);
//     setShowEditAvailabilityDialog(true);
//   };

//   const handleCloseEditAvailabilityDialog = () => {
//     setShowEditAvailabilityDialog(false);
//     setAvailabilityToEdit(null);
//   };

//   const handleEditAvailability = async () => {
//     if (editDay && editStartTime && editEndTime) {
//       if (editEndTime <= editStartTime) {
//         alert("End time must be after start time.");
//         return;
//       }

//       if (hasOverlappingAvailability(editDay, editStartTime, editEndTime, availabilityToEdit)) {
//         alert("The edited availability time overlaps with existing availability.");
//         return;
//       }

//       try {
//         const response = await fetch(
//           `http://localhost:3001/api/mentor/${mentorinfo.mentorkey}/availability`,
//           {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               dayOfWeek: editDay,
//               oldStartTime: availabilityToEdit.start_time,
//               oldEndTime: availabilityToEdit.end_time,
//               newStartTime: editStartTime,
//               newEndTime: editEndTime,
//             }),
//           }
//         );
//         if (response.ok) {
//           // Refresh availability
//           await fetchAvailability();
//           handleCloseEditAvailabilityDialog();
//         } else {
//           const data = await response.json();
//           alert(data.message || "Failed to update availability");
//         }
//       } catch (error) {
//         console.error("Error updating availability:", error);
//       }
//     } else {
//       alert("Please fill in all fields");
//     }
//   };

//   const handleDeleteAvailability = async (availabilitySlot) => {
//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete the availability on ${availabilitySlot.day_of_week} from ${availabilitySlot.start_time} to ${availabilitySlot.end_time}?`
//     );
//     if (!confirmDelete) return;

//     try {
//       const response = await fetch(
//         `http://localhost:3001/api/mentor/${mentorinfo.mentorkey}/availability`,
//         {
//           method: "DELETE",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             dayOfWeek: availabilitySlot.day_of_week,
//             startTime: availabilitySlot.start_time,
//             endTime: availabilitySlot.end_time,
//           }),
//         }
//       );
//       if (response.ok) {
//         // Refresh availability
//         await fetchAvailability();
//       } else {
//         const data = await response.json();
//         alert(data.message || "Failed to delete availability");
//       }
//     } catch (error) {
//       console.error("Error deleting availability:", error);
//     }
//   };

//   // Export Calendar Handlers
//   const handleOpenExportDialog = () => {
//     setShowExportDialog(true);
//     setExportStartDate("");
//     setExportEndDate("");
//   };

//   const handleCloseExportDialog = () => {
//     setShowExportDialog(false);
//   };

//   const handleExportCalendar = async () => {
//     if (!exportStartDate || !exportEndDate) {
//       alert("Please select both start and end dates.");
//       return;
//     }

//     if (exportEndDate < exportStartDate) {
//       alert("End date must be after start date.");
//       return;
//     }

//     try {
//       const mentorkey = mentorinfo.mentorkey;
//       const response = await fetch(
//         `http://localhost:3001/api/calendar/generate-ics/${mentorkey}?startDate=${exportStartDate}&endDate=${exportEndDate}`
//       );

//       if (!response.ok) {
//         const data = await response.json();
//         alert(data.message || "Failed to export calendar.");
//         return;
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/calendar' }));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'meetings.ics');
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//       handleCloseExportDialog();
//     } catch (error) {
//       console.error("Error exporting calendar:", error);
//       alert("An error occurred while exporting the calendar.");
//     }
//   };

//   // Handle Event Selection (Meeting or Blackout)
//   const handleSelectEvent = (event) => {
//     setSelectedEvent(event);
//     setNewDate("");
//     setNewTime("");
//   };

//   const handleCloseEventDialog = () => {
//     setSelectedEvent(null);
//     setNewDate("");
//     setNewTime("");
//   };

//   const handleRescheduleMeeting = async () => {
//     if (!newDate || !newTime) {
//       alert("Please select both new date and time.");
//       return;
//     }

//     const newDateTime = `${newDate}T${newTime}`;
//     try {
//       const response = await fetch(
//         "http://localhost:3001/api/meetings/reschedule",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             meetingKey: selectedEvent.meetingKey,
//             newDateTime,
//           }),
//         }
//       );

//       if (response.status === 409) {
//         alert("Time conflict! Please select a different time.");
//       } else if (response.status === 400) {
//         const data = await response.json();
//         alert(data.message);
//       } else if (response.ok) {
//         setEvents(
//           events.map((event) =>
//             event.meetingKey === selectedEvent.meetingKey
//               ? {
//                   ...event,
//                   start: new Date(newDateTime),
//                   end: new Date(
//                     new Date(newDateTime).getTime() + 60 * 60 * 1000
//                   ),
//                 }
//               : event
//           )
//         );
//         handleCloseEventDialog();
//       } else {
//         const data = await response.json();
//         alert(data.message || "Error rescheduling meeting.");
//       }
//     } catch (error) {
//       console.error("Error rescheduling meeting:", error);
//     }
//   };

//   const handleCancelMeeting = () => {
//     // Open confirmation dialog
//     setShowCancelConfirmation(true);
//   };

//   const confirmCancelMeeting = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:3001/api/meetings/cancel",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             meetingKey: selectedEvent.meetingKey,
//           }),
//         }
//       );

//       if (response.ok) {
//         // Remove the meeting from events
//         setEvents(
//           events.filter(event => event.meetingKey !== selectedEvent.meetingKey)
//         );
//         handleCloseEventDialog();
//         setShowCancelConfirmation(false);
//         alert("Meeting canceled successfully.");
//       } else {
//         const data = await response.json();
//         alert(data.message || "Failed to cancel meeting.");
//       }
//     } catch (error) {
//       console.error("Error canceling meeting:", error);
//       alert("An error occurred while canceling the meeting.");
//     }
//   };

//   const cancelCancelMeeting = () => {
//     setShowCancelConfirmation(false);
//   };

//   const getAvailabilityByDay = (day) => {
//     const dayAvailabilities = availability.filter(avail => avail.day_of_week === day);
//     if (dayAvailabilities.length === 0) return "No Availability";
//     return dayAvailabilities.map((a, index) => (
//       <Box key={index} display="flex" alignItems="center" mb={1}>
//         <Typography variant="body2">
//           {a.start_time} - {a.end_time}
//         </Typography>
//         <IconButton
//           size="small"
//           color="primary"
//           onClick={() => handleOpenEditAvailabilityDialog(a)}
//           sx={{ ml: 1 }}
//         >
//           <EditIcon fontSize="small" />
//         </IconButton>
//         <IconButton
//           size="small"
//           color="secondary"
//           onClick={() => handleDeleteAvailability(a)}
//         >
//           <DeleteIcon fontSize="small" />
//         </IconButton>
//       </Box>
//     ));
//   };

//   return (
//     <div className='mentor-meetings'>

//       <div className="logo-title-container">
//         <img src={logo} alt="logo" className="logo" />
//         <h1 className="title-header">Meetings</h1>
//       </div>

//       <div className="sidebarA">
//         {/* Navigation Buttons */}
//         <div className="nav-buttonsA">
//           <motion.button
//             className="icon"
//             onClick={() => navigate("/interact-with-mentee")}
//             whileHover={{ scale: 1.1 }}
//             transition={{ duration: 0.1 }}
//           >
//             <img src={chat} alt="chat" />
//           </motion.button>
//           <motion.button
//             className="icon"
//             onClick={() => navigate("/write-mentee-progression")}
//             whileHover={{ scale: 1.1 }}
//             transition={{ duration: 0.1 }}
//           >
//             <img src={write} alt="write" />
//           </motion.button>
//           <motion.button
//             className="icon"
//             onClick={() => navigate("/assign-homework")}
//             whileHover={{ scale: 1.1 }}
//             transition={{ duration: 0.1 }}
//           >
//             <img src={hw} alt="create" />
//           </motion.button>
//           <motion.button
//             className="icon1"
//             onClick={() => navigate("/mentor-meetings")}
//             whileHover={{ scale: 1.1 }}
//             transition={{ duration: 0.1 }}
//           >
//             <img src={calendarImg} alt="calendar" />
//           </motion.button>
//         </div>

//         {/* Theme Toggle */}
//         <div className="slider-section">
//           <label className="slider-container">
//             <input
//               type="checkbox"
//               checked={isDarkMode}
//               onChange={toggleTheme}
//             />
//             <span className="slider"></span>
//           </label>
//         </div>

//         {/* Logout Button */}
//         <motion.button
//           className="logout-buttonV2"
//           onClick={handleLogout}
//           whileHover={{ scale: 1.1 }}
//           transition={{ duration: 0.3 }}
//         >
//           <img src={logout} alt="logout" />
//         </motion.button>
//       </div>

//       <div className="content-wrapperVA">
//         <div className="chat-boxA">
//           <div className="box1">
//             <div className="box">
//               <div className="main-content">

//                 <Container sx={{ mt: 4 }}>
//                   <Typography style={{ color: 'black' }} variant="h4" align="center" gutterBottom>
//                     Manage Your Availability
//                   </Typography>

//                   {/* Add Availability and Add Blackout Date Buttons */}
//                   <Box display="flex" justifyContent="center" mb={2}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       startIcon={<AddIcon />}
//                       onClick={handleOpenAddAvailabilityDialog}
//                     >
//                       Add Availability
//                     </Button>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={handleOpenAddBlackoutDialog}
//                       sx={{ ml: 2 }}
//                     >
//                       Add Blackout Date
//                     </Button>
//                   </Box>

//                   {/* Availability Table */}
//                   <TableContainer component={Paper} sx={{ mb: 4 }}>
//                     <Table>
//                       <TableHead>
//                         <TableRow>
//                           {daysOfWeek.map((day, index) => (
//                             <TableCell key={index} align="center">
//                               {day}
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         <TableRow>
//                           {daysOfWeek.map((day, index) => (
//                             <TableCell key={index}>
//                               {getAvailabilityByDay(day)}
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       </TableBody>
//                     </Table>
//                   </TableContainer>

//                   <Typography style={{ color: 'black' }} variant="h4" align="center" gutterBottom>
//                     Your Scheduled Meetings
//                   </Typography>

//                   {/* Export Calendar Button */}
//                   <Box display="flex" justifyContent="center" mb={2}>
//                     <Button
//                       variant="outlined"
//                       color="secondary"
//                       startIcon={<DownloadIcon />}
//                       onClick={handleOpenExportDialog}
//                       sx={{ mb: 2 }}
//                     >
//                       Export Calendar
//                     </Button>
//                   </Box>

//                   <Calendar
//                     localizer={localizer}
//                     events={events}
//                     startAccessor="start"
//                     endAccessor="end"
//                     style={{ height: 500, color: 'black' }}
//                     onSelectEvent={handleSelectEvent}
//                   />
//                 </Container>

//                 {/* Event Details Dialog */}
//                 {selectedEvent && (
//                   <Dialog
//                     open={Boolean(selectedEvent)}
//                     onClose={handleCloseEventDialog}
//                     maxWidth="sm"
//                     fullWidth
//                   >
//                     <DialogTitle>
//                       {selectedEvent.type === "meeting"
//                         ? "Meeting Details"
//                         : "Blackout Date"}
//                     </DialogTitle>
//                     <DialogContent>
//                       {selectedEvent.type === "meeting" ? (
//                         <>
//                           <Typography variant="body1" gutterBottom>
//                             <strong>Mentee:</strong> {selectedEvent.mentee_name}
//                           </Typography>
//                           <Typography variant="body1" gutterBottom>
//                             <strong>Date:</strong> {selectedEvent.start.toDateString()}
//                           </Typography>
//                           <Typography variant="body1" gutterBottom>
//                             <strong>Time:</strong>{" "}
//                             {selectedEvent.start.toLocaleTimeString()} -{" "}
//                             {selectedEvent.end.toLocaleTimeString()}
//                           </Typography>
//                           <Typography variant="h6" gutterBottom>
//                             Reschedule Meeting
//                           </Typography>
//                           <Box display="flex" flexDirection="column" gap={2} mt={2}>
//                             <TextField
//                               type="date"
//                               value={newDate}
//                               onChange={(e) => setNewDate(e.target.value)}
//                               label="New Date"
//                               InputLabelProps={{ shrink: true }}
//                               fullWidth
//                             />
//                             <TextField
//                               type="time"
//                               value={newTime}
//                               onChange={(e) => setNewTime(e.target.value)}
//                               label="New Time"
//                               InputLabelProps={{ shrink: true }}
//                               fullWidth
//                             />
//                           </Box>
//                         </>
//                       ) : (
//                         <>
//                           <Typography variant="body1" gutterBottom>
//                             <strong>Date:</strong> {selectedEvent.start.toDateString()}
//                           </Typography>
//                           <Typography variant="body1" gutterBottom>
//                             <strong>Reason:</strong> {selectedEvent.reason}
//                           </Typography>
//                         </>
//                       )}
//                     </DialogContent>
//                     <DialogActions>
//                       {selectedEvent.type === "meeting" ? (
//                         <>
//                           <Button
//                             onClick={handleRescheduleMeeting}
//                             variant="contained"
//                             color="primary"
//                           >
//                             Reschedule
//                           </Button>
//                           <Button
//                             onClick={handleCancelMeeting}
//                             variant="contained"
//                             color="secondary"
//                           >
//                             Cancel Meeting
//                           </Button>
//                           <Button
//                             onClick={handleCloseEventDialog}
//                             variant="outlined"
//                             color="primary"
//                           >
//                             Close
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <Button
//                             onClick={handleDeleteBlackoutDate}
//                             variant="contained"
//                             color="secondary"
//                           >
//                             Remove Blackout Date
//                           </Button>
//                           <Button
//                             onClick={handleCloseEventDialog}
//                             variant="outlined"
//                             color="primary"
//                           >
//                             Close
//                           </Button>
//                         </>
//                       )}
//                     </DialogActions>
//                   </Dialog>
//                 )}

//                 {/* Cancel Meeting Confirmation Dialog */}
//                 <Dialog
//                   open={showCancelConfirmation}
//                   onClose={cancelCancelMeeting}
//                   maxWidth="xs"
//                   fullWidth
//                 >
//                   <DialogTitle>Confirm Cancellation</DialogTitle>
//                   <DialogContent>
//                     <DialogContentText>
//                       Are you sure you want to cancel this meeting?
//                     </DialogContentText>
//                   </DialogContent>
//                   <DialogActions>
//                     <Button
//                       onClick={confirmCancelMeeting}
//                       variant="contained"
//                       color="secondary"
//                     >
//                       Yes, Cancel
//                     </Button>
//                     <Button
//                       onClick={cancelCancelMeeting}
//                       variant="outlined"
//                       color="primary"
//                     >
//                       No
//                     </Button>
//                   </DialogActions>
//                 </Dialog>

//                 {/* Add Blackout Date Dialog */}
//                 <Dialog
//                   open={showAddBlackoutDialog}
//                   onClose={handleCloseAddBlackoutDialog}
//                   maxWidth="sm"
//                   fullWidth
//                 >
//                   <DialogTitle>Add Blackout Date</DialogTitle>
//                   <DialogContent>
//                     <Box display="flex" flexDirection="column" gap={2} mt={2}>
//                       <TextField
//                         type="date"
//                         value={blackoutDate}
//                         onChange={(e) => setBlackoutDate(e.target.value)}
//                         label="Date"
//                         InputLabelProps={{ shrink: true }}
//                         fullWidth
//                       />
//                       <TextField
//                         value={blackoutReason}
//                         onChange={(e) => setBlackoutReason(e.target.value)}
//                         label="Reason"
//                         fullWidth
//                       />
//                     </Box>
//                   </DialogContent>
//                   <DialogActions>
//                     <Button
//                       onClick={handleAddBlackoutDate}
//                       variant="contained"
//                       color="primary"
//                     >
//                       Add
//                     </Button>
//                     <Button
//                       onClick={handleCloseAddBlackoutDialog}
//                       variant="outlined"
//                       color="secondary"
//                     >
//                       Cancel
//                     </Button>
//                   </DialogActions>
//                 </Dialog>

//                 {/* Add Availability Dialog */}
//                 <Dialog
//                   open={showAddAvailabilityDialog}
//                   onClose={handleCloseAddAvailabilityDialog}
//                   maxWidth="sm"
//                   fullWidth
//                 >
//                   <DialogTitle>Add Availability</DialogTitle>
//                   <DialogContent>
//                     <Box display="flex" flexDirection="column" gap={2} mt={2}>
//                       <FormControl fullWidth>
//                         <InputLabel id="select-day-label">Day of the Week</InputLabel>
//                         <Select
//                           labelId="select-day-label"
//                           value={selectedDay}
//                           label="Day of the Week"
//                           onChange={(e) => setSelectedDay(e.target.value)}
//                         >
//                           {daysOfWeek.map((day) => (
//                             <MenuItem key={day} value={day}>
//                               {day}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                       <TextField
//                         type="time"
//                         value={startTime}
//                         onChange={(e) => setStartTime(e.target.value)}
//                         label="Start Time"
//                         InputLabelProps={{ shrink: true }}
//                         inputProps={{ step: 300 }}
//                         fullWidth
//                       />
//                       <TextField
//                         type="time"
//                         value={endTime}
//                         onChange={(e) => setEndTime(e.target.value)}
//                         label="End Time"
//                         InputLabelProps={{ shrink: true }}
//                         inputProps={{ step: 300 }}
//                         fullWidth
//                       />
//                     </Box>
//                   </DialogContent>
//                   <DialogActions>
//                     <Button
//                       onClick={handleAddAvailability}
//                       variant="contained"
//                       color="primary"
//                     >
//                       Save
//                     </Button>
//                     <Button
//                       onClick={handleCloseAddAvailabilityDialog}
//                       variant="outlined"
//                       color="secondary"
//                     >
//                       Cancel
//                     </Button>
//                   </DialogActions>
//                 </Dialog>

//                 {/* Edit Availability Dialog */}
//                 <Dialog
//                   open={showEditAvailabilityDialog}
//                   onClose={handleCloseEditAvailabilityDialog}
//                   maxWidth="sm"
//                   fullWidth
//                 >
//                   <DialogTitle>Edit Availability</DialogTitle>
//                   <DialogContent>
//                     <Box display="flex" flexDirection="column" gap={2} mt={2}>
//                       <FormControl fullWidth>
//                         <InputLabel id="edit-select-day-label">Day of the Week</InputLabel>
//                         <Select
//                           labelId="edit-select-day-label"
//                           value={editDay}
//                           label="Day of the Week"
//                           onChange={(e) => setEditDay(e.target.value)}
//                         >
//                           {daysOfWeek.map((day) => (
//                             <MenuItem key={day} value={day}>
//                               {day}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                       <TextField
//                         type="time"
//                         value={editStartTime}
//                         onChange={(e) => setEditStartTime(e.target.value)}
//                         label="Start Time"
//                         InputLabelProps={{ shrink: true }}
//                         inputProps={{ step: 300 }}
//                         fullWidth
//                       />
//                       <TextField
//                         type="time"
//                         value={editEndTime}
//                         onChange={(e) => setEditEndTime(e.target.value)}
//                         label="End Time"
//                         InputLabelProps={{ shrink: true }}
//                         inputProps={{ step: 300 }}
//                         fullWidth
//                       />
//                     </Box>
//                   </DialogContent>
//                   <DialogActions>
//                     <Button
//                       onClick={handleEditAvailability}
//                       variant="contained"
//                       color="primary"
//                     >
//                       Update
//                     </Button>
//                     <Button
//                       onClick={handleCloseEditAvailabilityDialog}
//                       variant="outlined"
//                       color="secondary"
//                     >
//                       Cancel
//                     </Button>
//                   </DialogActions>
//                 </Dialog>

//                 {/* Export Calendar Dialog */}
//                 <Dialog
//                   open={showExportDialog}
//                   onClose={handleCloseExportDialog}
//                   maxWidth="sm"
//                   fullWidth
//                 >
//                   <DialogTitle>Export Calendar</DialogTitle>
//                   <DialogContent>
//                     <Box display="flex" flexDirection="column" gap={2} mt={2}>
//                       <TextField
//                         type="date"
//                         value={exportStartDate}
//                         onChange={(e) => setExportStartDate(e.target.value)}
//                         label="Start Date"
//                         InputLabelProps={{ shrink: true }}
//                         fullWidth
//                       />
//                       <TextField
//                         type="date"
//                         value={exportEndDate}
//                         onChange={(e) => setExportEndDate(e.target.value)}
//                         label="End Date"
//                         InputLabelProps={{ shrink: true }}
//                         fullWidth
//                       />
//                     </Box>
//                   </DialogContent>
//                   <DialogActions>
//                     <Button
//                       onClick={handleExportCalendar}
//                       variant="contained"
//                       color="primary"
//                       startIcon={<DownloadIcon />}
//                     >
//                       Export
//                     </Button>
//                     <Button
//                       onClick={handleCloseExportDialog}
//                       variant="outlined"
//                       color="secondary"
//                     >
//                       Cancel
//                     </Button>
//                   </DialogActions>
//                 </Dialog>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MentorMeetings;
