import React, { useState } from 'react';
import './ViewProgression.css';
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import logo from '../assets/WDC.png';

function ViewProgressions() {
  const navigate = useNavigate(); // <-- Initialize navigate
  const [progressReports] = useState([
    { mentee: 'Jane Smith', mentor: 'John Doe', date: '2024-10-15', report: 'Completed first stage of the project.' },
    { mentee: 'Mark White', mentor: 'Alice Brown', date: '2024-10-16', report: 'Improved time management skills.' },
    { mentee: 'Jane Smith', mentor: 'John Doe', date: '2024-10-17', report: 'Started working on final project phase.' },
  ]);

  const [filter, setFilter] = useState('');

  const filteredReports = progressReports.filter(
    report =>
      report.mentee.toLowerCase().includes(filter.toLowerCase()) ||
      report.mentor.toLowerCase().includes(filter.toLowerCase())
  );


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
      <h1 className="welcome-message">View Mentee Progression</h1>
    </header>




    <div className="view-progressions">
      <div className="search">
        <input
          type="text"
          placeholder="Filter by mentee or mentor"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      


      <ul>
        {filteredReports.map((report, index) => (
          <li key={index}>
            <strong>{report.mentee}</strong> (Mentor: {report.mentor}) on {report.date}: {report.report}
          </li>
        ))}
      </ul>
      <div className="rectangle">
      </div>
    </div>
    </div>
  );
}

export default ViewProgressions;
