
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './Admin.css'; // Import the CSS file
import logo from './assets/WDC.png';// Adjust the path as needed

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
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main className="main-content">
        <h1 className="welcome-message">Welcome Admin {adminName}</h1>
        <div className="button-container">
          <button className="circle-button" onClick={() => navigate('/see-interactions')}>
              See Interactions
          </button>
          <button className="circle-button" onClick={() => navigate('/assign-mentor')}>
            Assign Mentor to Mentee
          </button>
          <button className="circle-button" onClick={() => navigate('/view-progressions')}>
            View Progressions
          </button>
          <button className="circle-button" onClick={() => navigate('/create-account')}>
            Create Mentee/Mentor Account
          </button>
        </div>
      </main>
      
    </div>
  );
}

export default AdminHome;
