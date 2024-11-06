import React, { useState } from 'react';
import './WriteMenteeProgression.css';
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import logo from '../assets/WDC.png';



function WriteMenteeProgression() {
  const navigate = useNavigate(); // <-- Initialize navigate

  const [progressReports, setProgressReports] = useState([
    { mentee: 'Jane Smith', date: '2024-10-10', report: 'Completed first milestone on the project.' },
    { mentee: 'Mark White', date: '2024-10-12', report: 'Improved communication during meetings.' },
  ]);

  const [newMentee, setNewMentee] = useState('');
  const [newReport, setNewReport] = useState('');
  const [newDate, setNewDate] = useState('');

  const handleAddReport = () => {
    if (newMentee.trim() && newReport.trim() && newDate.trim()) {
      setProgressReports([...progressReports, { mentee: newMentee, date: newDate, report: newReport }]);
      setNewMentee('');
      setNewReport('');
      setNewDate('');
    }
  };
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };


  return (
    <div className="write-mentee-progression">

    <header className="header-container">
    <div className="top-header">

      <button
        className="logo-button"
        onClick={() => navigate("/mentor-home")}
      >
        <img src={logo} alt="Logo" className="logo" />
      </button>

      <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>

      </div>
      <h1 className="welcome-message">Write Mentee Progression</h1>
    </header>

  
      <div className="progress-form">
        <input
          type="text"
          value={newMentee}
          onChange={(e) => setNewMentee(e.target.value)}
          placeholder="Enter mentee name"
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <textarea
          value={newReport}
          onChange={(e) => setNewReport(e.target.value)}
          placeholder="Write progress report here"
        />
        <button onClick={handleAddReport}>Submit Progress Report</button>
      </div>
    </div>
  );
}

export default WriteMenteeProgression;
