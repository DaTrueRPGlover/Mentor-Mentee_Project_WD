// src/components/mentormeetings.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MenteeMeetings.css';
import logo from '../assets/WDC2.png';
import chat from '../assets/chat.png';
import write from '../assets/write.png';
import assign from '../assets/assign.png';
import calendarIcon from '../assets/calendar.png';
import logoutIcon from '../assets/logout.png';

const mockEvents = [
  { id: 1, title: 'Meeting with Dr. Smith', start: new Date(2025,7,10,10), end: new Date(2025,7,10,11), joinLink: 'https://zoom.us/j/123456789' },
  { id: 2, title: 'Meeting with Prof. Lee', start: new Date(2025,7,12,14), end: new Date(2025,7,12,15), joinLink: 'https://meet.google.com/abc-defg-hij' },
  { id: 3, title: 'Mentor Session', start: new Date(2025,7,15,9,30), end: new Date(2025,7,15,10,30), joinLink: 'https://teams.microsoft.com/l/meetup-join/...' }
];

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format: (date, str) => format(date, str, { locale: enUS }),
  parse: (str, fmt) => parse(str, fmt, new Date(), { locale: enUS }),
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales
});

export default function MentorMeetings() {
  const navigate = useNavigate();
  const [events] = useState(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    // ensure body background reset on this page too
    document.body.classList.remove('dark-mode');
  }, []);

  return (
    <div className="mentee-meetings">
      {/* Topbar */}
      <header className="header">
        <div className="logo-title-container">
          <img src={logo} alt="logo" className="logo" />
          <h1 className="title-header">Meetings</h1>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-main">
          <motion.button className="icon" onClick={() => navigate('/interact-mentor')} whileHover={{ scale: 1.08 }}>
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button className="icon" onClick={() => navigate('/todo-progression')} whileHover={{ scale: 1.08 }}>
            <img src={write} alt="write" />
          </motion.button>
          <motion.button className="icon" onClick={() => navigate('/check-hw')} whileHover={{ scale: 1.08 }}>
            <img src={assign} alt="assign" />
          </motion.button>
          <motion.button className="icon active" onClick={() => navigate('/mentee-meetings')} whileHover={{ scale: 1.08 }}>
            <img src={calendarIcon} alt="calendar" />
          </motion.button>
        </div>

        <div className="logout-container">
          <motion.button
            className="icon logout-btn"
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="logout" />
          </motion.button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-container">
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%', width: '100%' }}
            onSelectEvent={event => setSelectedEvent(event)}
          />
        </div>
      </main>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="event-dialog-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="event-dialog" onClick={e => e.stopPropagation()}>
            <button className="close-icon" onClick={() => setSelectedEvent(null)}>✕</button>
            <h2>{selectedEvent.title}</h2>
            <p><strong>Start:</strong> {selectedEvent.start.toLocaleString()}</p>
            <p><strong>End:</strong> {selectedEvent.end.toLocaleString()}</p>
            <div className="dialog-actions">
              <a
                href={selectedEvent.joinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="join-btn"
                onClick={e => e.stopPropagation()}
              >
                Join Meeting
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
