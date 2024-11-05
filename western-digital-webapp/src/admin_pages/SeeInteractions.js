import React, { useState } from 'react';
import './SeeInteractions.css';
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import logo from '../assets/WDC.png';

function SeeInteractions() {
 
  const [interactions] = useState([
    { mentor: 'John Doe', mentee: 'Jane Smith', date: '2024-10-15', description: 'Reviewed project progress' },
    { mentor: 'Alice Brown', mentee: 'Mark White', date: '2024-10-16', description: 'Discussed new assignment' },
    { mentor: 'John Doe', mentee: 'Mark White', date: '2024-10-17', description: 'Provided feedback on homework' },
  ]);

  const [mentorFilter, setMentorFilter] = useState('');
  const [menteeFilter, setMenteeFilter] = useState('');

  const filteredInteractions = interactions.filter(
    interaction =>
      interaction.mentor.toLowerCase().includes(mentorFilter.toLowerCase()) &&
      interaction.mentee.toLowerCase().includes(menteeFilter.toLowerCase())
  );

  const navigate = useNavigate(); // <-- Initialize navigate
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="mentor-meetings">

    <header className="header-container">
    <div className="top-header">

      <button
        className="logo-button"
        onClick={() => navigate("/admin-home")}
      >
        <img src={logo} alt="Logo" className="logo" />
      </button>

      <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>

      </div>
      <h1 className="welcome-message">View Interactions</h1>
    </header>

      <div className="search">
        <div className="filter-section">
          <h2>Search By Mentor</h2>
          <input
            type="text"
            placeholder="Filter by Mentor"
            value={mentorFilter}
            onChange={(e) => setMentorFilter(e.target.value)}
          />
          <button className="button">Filter Mentor</button>
        </div>
        <div className="filter-section">
          <h2>Search By Mentee</h2>
          <input
            type="text"
            placeholder="Filter by Mentee"
            value={menteeFilter}
            onChange={(e) => setMenteeFilter(e.target.value)}
          />
          <button className="button">Filter Mentee</button>
        </div>
      </div>

      <ul>
        {filteredInteractions.map((interaction, index) => (
          <li key={index}>
            <strong>{interaction.mentor}</strong> with <strong>{interaction.mentee}</strong> on {interaction.date}: {interaction.description}
          </li>
        ))}
      </ul>
      
    
    </div>
  );
}

export default SeeInteractions;
