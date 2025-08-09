// src/components/checkHW.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import './checkHW.css';
import logo from "../assets/WDC2.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import assign from "../assets/assign.png";
import calendar from "../assets/calendar.png";
import logout from "../assets/logout.png";

const mockHomework = [
  { id: 1, title: "Math Assignment", description: "Complete problems 1-10.", assigned: "2025-07-28", due: "2025-08-12" },
  { id: 2, title: "Science Project", description: "Build a simple circuit.", assigned: "2025-07-30", due: "2025-08-15" },
  { id: 3, title: "History Essay", description: "2-page essay on WWI causes.", assigned: "2025-08-01", due: "2025-08-18" }
];

const mockMeetings = [
  { id: 'm1', with: 'Dr. Smith', date: '2025-08-10', time: '10:00 AM', link: 'https://zoom.us/j/123456789' },
  { id: 'm2', with: 'Professor Lee', date: '2025-08-12', time: '2:00 PM', link: 'https://zoom.us/j/987654321' },
  { id: 'm3', with: 'Mentor Jane', date: '2025-08-15', time: '11:30 AM', link: 'https://zoom.us/j/555666777' }
];

export default function CheckHW() {
  const navigate = useNavigate();
  const [homeworkData, setHomeworkData] = useState([]);
  const [meetings] = useState(mockMeetings);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    setHomeworkData(mockHomework);
    document.body.classList.remove('dark-mode');
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="check-hw">
      {/* HEADER */}
      <header className="header">
        <div className="logo-title">
          <img src={logo} alt="logo" className="logo" />
          <h1 className="title">Assigned Homework</h1>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-main">
          <motion.button className="icon" onClick={() => navigate("/interact-mentor")} whileHover={{ scale: 1.08 }}>
            <img src={chat} alt="Chat" />
          </motion.button>
          <motion.button className="icon" onClick={() => navigate("/todo-progression")} whileHover={{ scale: 1.08 }}>
            <img src={write} alt="Write" />
          </motion.button>
          <motion.button className="icon active" onClick={() => navigate("/check-hw")} whileHover={{ scale: 1.08 }}>
            <img src={assign} alt="Assign" />
          </motion.button>
          <motion.button className="icon" onClick={() => navigate("/mentee-meetings")} whileHover={{ scale: 1.08 }}>
            <img src={calendar} alt="Calendar" />
          </motion.button>
        </div>

        {/* Logout at bottom */}
        <div className="logout-container">
          <motion.button className="icon logout-btn" onClick={handleLogout} whileHover={{ scale: 1.08 }}>
            <img src={logout} alt="Logout" />
          </motion.button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-grid">
        {/* Assignments */}
        <section className="assignments">
          {homeworkData.length === 0 ? (
            <p className="no-homework">No assignments available.</p>
          ) : (
            <div className="card-grid">
              {homeworkData.map(hw => (
                <Link to={`/homework/${hw.id}`} key={hw.id} className="homework-card">
                  <h2>{hw.title}</h2>
                  <p>{hw.description}</p>
                  <div className="dates">
                    <span>Assigned: {format(new Date(hw.assigned), 'MMM dd, yyyy')}</span>
                    <span>Due: {format(new Date(hw.due), 'MMM dd, yyyy')}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Meetings */}
        <aside className="meetings">
          <h2>Upcoming Meetings</h2>
          {meetings.length === 0 ? (
            <p>No upcoming meetings.</p>
          ) : (
            <div className="meeting-grid">
              {meetings.map(m => (
                <div
                  key={m.id}
                  className="meeting-card"
                  onClick={() => setSelectedMeeting(m)}
                  style={{ cursor: "pointer" }}
                >
                  <p><strong>With:</strong> {m.with}</p>
                  <p><strong>Date:</strong> {m.date}</p>
                  <p><strong>Time:</strong> {m.time}</p>
                </div>
              ))}
            </div>
          )}
        </aside>
      </main>

      {/* POPUP MODAL */}
      {selectedMeeting && (
        <div className="modal-overlay" onClick={() => setSelectedMeeting(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedMeeting(null)}>✖</button>
            <h3>Meeting Details</h3>
            <p><strong>With:</strong> {selectedMeeting.with}</p>
            <p><strong>Date:</strong> {selectedMeeting.date}</p>
            <p><strong>Time:</strong> {selectedMeeting.time}</p>
            <a href={selectedMeeting.link} target="_blank" rel="noopener noreferrer" className="join-link">
              Join Meeting
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
