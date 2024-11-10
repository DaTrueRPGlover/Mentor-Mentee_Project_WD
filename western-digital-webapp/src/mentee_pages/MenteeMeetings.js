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
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './MenteeMeetings.css';
import { useNavigate } from "react-router-dom";
import logo from '../assets/WDC.png';
//imports 

//get current time
const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

//parse time
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

//main mentee meetings function
function MenteeMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.userId; 
        console.log('User ID:', userId); 

        const response = await axios.get('http://localhost:3001/api/meetings/meetings', {
          params: { userId },
        });
        //get all the meertings for loggined user

        // console.log('Fetched meetings:', response.data); 
        //parse through the returned json to get each thing we need to display 
        const meetingsData = response.data.map((meeting) => {
          console.log('Processing meeting:', meeting); // Debugging
          console.log('User ID:', userId, 'Mentor Key:', meeting.mentorkey, 'Mentee Key:', meeting.menteekey); // Debugging

          return {
            title: `Meeting with ${
              userId === meeting.mentorkey ? meeting.mentee_name : meeting.mentor_name
            }`,
            start: new Date(meeting.datetime),
            end: new Date(new Date(meeting.datetime).getTime() + 60 * 60 * 1000),
            mentor: meeting.mentor_name,
            mentee: meeting.mentee_name,
            link: meeting.zoom_link,
            zoom_password: meeting.zoom_password,
          }; //parse through the returned json to get each thing we need to display 
        });
        setMeetings(meetingsData); 
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };
    fetchMeetings();
  }, []);
  //when meeting is clicked
  const handleSelectEvent = (event) => {
    setSelectedMeeting(event); 
    setOpen(true);
  };
  //when meeting is closed
  const handleClose = () => {
    setOpen(false);
    setSelectedMeeting(null);
  };

  const navigate = useNavigate();
  //logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  //displaying everything in a calendar with a popup dailog box when they click on a certian event
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

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth={true}
        BackdropProps={{
          className: 'custom-backdrop',
        }}
        PaperProps={{
          className: 'custom-paper',
        }}
      >
        <DialogTitle className="dialog-title">
          Meeting Details
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="dialog-content">
          {selectedMeeting && (
            <div>
              <p><strong>Title:</strong> {selectedMeeting.title}</p>
              <p><strong>Mentor:</strong> {selectedMeeting.mentor}</p>
              <p><strong>Mentee:</strong> {selectedMeeting.mentee}</p>
              <p><strong>Start Time:</strong> {selectedMeeting.start.toLocaleString()}</p>
              <p><strong>End Time:</strong> {selectedMeeting.end.toLocaleString()}</p>
              <p>
                <strong>Meeting Link:</strong>{' '}
                <a
                  href={selectedMeeting.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meeting-link"
                >
                  {selectedMeeting.link}
                </a>
              </p>
              <p><strong>Zoom Password:</strong> {selectedMeeting.zoom_password}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleClose} className="dialog-button">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MenteeMeetings;
