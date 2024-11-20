// MenteeMeetings.js
import React, { useState, useEffect } from 'react';
import './MenteeMeetings.css';
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

const linkify = (text) => {
  // Updated pattern to match URLs with http(s), ftp, or those starting with www.
  const urlPattern = /(\b(?:https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  
  return text.split(urlPattern).map((part, index) => {
    if (urlPattern.test(part)) {
      // Ensure URLs without a protocol default to https://
      const href = part.startsWith("www.") ? `https://${part}` : part;
      return (
        <a key={index} href={href} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return part;
  });
};



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
          meetingKey: meeting.meetingkey,
        }));

        const mappedHomework = homeworkData.map(homework => ({
          title: `Homework: ${homework.title}`,
          start: new Date(homework.due_date),
          end: new Date(homework.due_date),
          type: 'homework',
          description: homework.description,
          assignedDate: homework.assigned_date,
          dueDate: homework.due_date,
          homeworkId: homework.homework_id,
        }));

        setEvents([...mappedMeetings, ...mappedHomework]);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleClosePopup = () => {
    setSelectedEvent(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="mentor-meetings">
      <header className="header-container">
        <div className="top-header">
          <button className="logo-button" onClick={() => navigate("/mentee-home")}>
            <img src={logo} alt="Logo" className="logo" />
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="purple">
          <h1 className="welcome-message">View Meetings and Homework</h1>
        </div>
      </header>

      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: '20px 0' }}
          className="calendar"
          onSelectEvent={handleSelectEvent}
        />
      </div>

      {selectedEvent && (
        <div className="popup">
          <div className="popup-content">
            {selectedEvent.type === 'meeting' ? (
              <>
                <h3>Meeting with {selectedEvent.mentor_name}</h3>
                <p>Zoom Link: <a href={selectedEvent.zoomLink} target="_blank" rel="noopener noreferrer">{selectedEvent.zoomLink}</a></p>
                <p>Zoom Password: {selectedEvent.zoomPassword}</p>
                <p>Date: {selectedEvent.start.toLocaleDateString()}</p>
                <p>Time: {selectedEvent.start.toLocaleTimeString()}</p>
                <button onClick={handleClosePopup}>Close</button>
              </>
            ) : (
              <>
                <h3>{selectedEvent.title}</h3>
                <p>Description: {linkify(selectedEvent.description)}</p>
                <p>Assigned Date: {new Date(selectedEvent.assignedDate).toLocaleDateString()}</p>
                <p>Due Date: {new Date(selectedEvent.dueDate).toLocaleDateString()}</p>
                <button onClick={handleClosePopup}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MenteeMeetings;
