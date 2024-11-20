// MenteeMeetings.js
import React, { useState, useEffect } from 'react';
import './MenteeMeetings.css';
import { useNavigate } from "react-router-dom";
import logo from '../assets/WDC.png';
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
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

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
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const menteeInfo = JSON.parse(localStorage.getItem('user'));
        const userId = menteeInfo.userId;
        const [meetingsResponse, homeworkResponse] = await Promise.all([
          fetch(`http://localhost:3001/api/meetings/meetings?userId=${userId}`),
          fetch(`http://localhost:3001/api/homework/mentee/${userId}`)
        ]);

        const meetingsData = await meetingsResponse.json();
        const homeworkData = await homeworkResponse.json();

        const mappedMeetings = meetingsData.map(meeting => ({
          title: `Meeting with ${meeting.mentor_name}`,
          start: new Date(meeting.datetime),
          end: new Date(new Date(meeting.datetime).getTime() + 60 * 60 * 1000),
          type: 'meeting',
          mentor_name: meeting.mentor_name,
          zoomLink: meeting.zoom_link,
          zoomPassword: meeting.zoom_password,
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate("/mentee-home")}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            View Meetings and Homework
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: '20px' }}
          onSelectEvent={(event) => setSelectedEvent(event)}
        />
      </div>

      {selectedEvent && (
        <Dialog open={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)}>
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
              </>
            ) : (
              <>
                <Typography>Description: {selectedEvent.description}</Typography>
                <Typography>Due Date: {new Date(selectedEvent.start).toLocaleDateString()}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedEvent(null)} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default MenteeMeetings;
