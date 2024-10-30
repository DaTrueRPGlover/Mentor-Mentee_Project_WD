import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MenteeHome.css';
import logo from '../assets/WDC.png';
import talk from '../assets/talk.png'; // Adjust the path as needed
import notes from '../assets/notes.png'; // Adjust the path as needed
import meetings from '../assets/meetings.png'; // Adjust the path as needed


function MenteeHome() {
  const navigate = useNavigate();

  // Retrieve mentee's name from local storage or context
  const menteeName = localStorage.getItem('menteeName') || 'Mentee';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="mentee-home">
      <img src={logo} alt="Logo" className="logo" />

      <header className="header-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        <h1 className="welcome-message">Welcome Mentee {menteeName}</h1>
      </header>

      <main className="main-content">
        <div className="button-container">
          <div className="circle">
            <h3 className="title">Interact with Mentor</h3>
            <img src={talk} alt="Talk" className="Talk" />

            <button
              className="circle-button"
              onClick={() => navigate('/interact-mentor')}
            >
              Choose
            </button>
          </div>

          <div className="circle">
            <h3 className="title">To-Do/Progression</h3>
            <img src={notes} alt="notes" className="Notes" />

            <button
              className="circle-button"
              onClick={() => navigate('/todo-progression')}
            >
              Choose
            </button>
          </div>

          <div className="circle">
            <h3 className="title">Mentee Meetings</h3>
            <img src={meetings} alt="meetings" className="Meetings" />

            <button
              className="circle-button"
              onClick={() => navigate('/mentee-meetings')}
            >
              Choose
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MenteeHome;
