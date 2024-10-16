import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MenteeHome.css'; // Import the CSS file
import logo from './assets/WDC.png';// Adjust the path as needed
function MenteeHome() {
  const navigate = useNavigate();

  // Retrieve mentee's name from local storage or context
  const menteeName = localStorage.getItem('menteeName') || 'Mentee';

  const handleLogout = () => {
    // Clear user data
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="mentee-home">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main className="main-content">
        <h1 className="welcome-message">Welcome Mentee {menteeName}</h1>
        <div className="button-container">
          <button className="circle-button" onClick={() => navigate('/interact-mentor')}>
            Interact with Mentor
          </button>
          <button className="circle-button" onClick={() => navigate('/todo-progression')}>
            To-Do/Progression
          </button>
          <button className="circle-button" onClick={() => navigate('/scheduled-meetings')}>
            Scheduled Meetings
          </button>
        </div>
      </main>
    </div>
  );
}

export default MenteeHome;
