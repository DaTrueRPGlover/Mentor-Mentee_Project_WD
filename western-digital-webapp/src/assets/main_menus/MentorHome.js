import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MentorHome.css'; // Import the CSS file
import logo from '../WDC.png'; // Adjust the path as needed

function MentorHome() {
  const navigate = useNavigate();

  // Retrieve mentor's name from local storage or context
  const mentorName = localStorage.getItem('mentorName') || 'Mentor';

  const handleLogout = () => {
    // Clear user data
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="mentor-home">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main className="main-content">
        <h1 className="welcome-message">Welcome Mentor {mentorName}</h1>
        <div className="button-container">
          <button className="circle-button" onClick={() => navigate('/interact-with-mentee')}>
            Interact with Mentee
          </button>
          <button className="circle-button" onClick={() => navigate('/write-mentee-progression')}>
            Write Mentee Progression
          </button>
          <button className="circle-button" onClick={() => navigate('/assign-homework')}>
            Assign Homework
          </button>
          <button className="circle-button" onClick={() => navigate('/mentee-meetings')}>
            Meetings with Mentee
          </button>
        </div>
      </main>
    </div>
  );
}

export default MentorHome;

