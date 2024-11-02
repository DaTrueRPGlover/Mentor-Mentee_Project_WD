import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MentorHome.css';

import logo from '../assets/WDC.png';
import talk from '../assets/talk.png';
import one from '../assets/one.png';
import notes from '../assets/notes.png';
import hw from '../assets/hw.png';

function MentorHome() {
  const navigate = useNavigate();
  const mentorName = localStorage.getItem('mentorName') || 'Mentor';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="mentor-home">
      <header className="header-container">
        <div className="top-header">
          <img src={logo} alt="Logo" className="logo" />
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h1 className="welcome-message">Welcome Mentor {mentorName}</h1>
      </header>

      <main className="main-content">
        <div className="button-container">
          
          <button
            className="circle"
            onClick={() => navigate('/interact-with-mentee')}
          >
            <img src={talk} alt="Talk" className="circle-image" />
            <h3 className="title">Interact with Mentee</h3>
          </button>

          <button
            className="circle"
            onClick={() => navigate('/assign-homework')}
          >
            <img src={hw} alt="HW" className="circle-image" />
            <h3 className="title">Assign Homework</h3>
          </button>

          <button
            className="circle"
            onClick={() => navigate('/write-mentee-progression')}
          >
            <img src={notes} alt="Notes" className="circle-image" />
            <h3 className="title">Write Progression</h3>
          </button>

          <button
            className="circle"
            onClick={() => navigate('/mentor-meetings')}
          >
            <img src={one} alt="One" className="circle-image" />
            <h3 className="title">Mentee Meetings</h3>
          </button>

    
        </div>
      </main>
    </div>
  );
}

export default MentorHome;
