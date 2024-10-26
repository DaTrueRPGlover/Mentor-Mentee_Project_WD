import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './AdminHome.css'; // Import the CSS file

import logo from '../assets/WDC.png'; // Adjust the path as needed
import talk from '../assets/talk.png'; // Adjust the path as needed
import twopeople from '../assets/twopeople.png'; // Adjust the path as needed
import one from '../assets/one.png'; // Adjust the path as needed
import notes from '../assets/notes.png'; // Adjust the path as needed

function AdminHome() {
  const navigate = useNavigate();

  // Retrieve admin's name from local storage or context
  const adminName = localStorage.getItem('adminName') || 'Admin';

  const handleLogout = () => {
    // Clear user data
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="admin-home">
      <img src={logo} alt="Logo" className="logo" />

      <header className="header-containerr">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>

        <h1 className="welcome-message">
          Welcome Admin {adminName}
        </h1>
      </header>

      <main className="main-content">
        <div className="button-container">

          <div className="circle">
            <h3 className="title">See Interactions</h3>
            <img src={talk} alt="Talk" className="Talk" />
            <button
              className="circle-button"
              onClick={() => navigate('/see-interactions')}
            >
              Choose
            </button>
          </div>

          <div className="circle">
            <h3 className="title">Assign Mentor to Mentee</h3>
            <img src={twopeople} alt="Twopeople" className="Twopeople" />
            <button
              className="circle-button"
              onClick={() => navigate('/assign-mentor')}
            >
              Choose
            </button>
          </div>

          <div className="circle">
            <h3 className="title">View Progressions</h3>
            <img src={notes} alt="Notes" className="Notes" />
            <button
              className="circle-button"
              onClick={() => navigate('/view-progressions')}
            >
              Choose
            </button>
          </div>

          <div className="circle">
            <h3 className="title">Create Mentee/Mentor Account</h3>
            <img src={one} alt="One" className="One" />
            <button className="circle-button" onClick={() => navigate('/create-account')}>
              Choose
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default AdminHome;
