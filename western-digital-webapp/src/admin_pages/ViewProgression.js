import React, { useState } from 'react';
import './ViewProgression.css';
import logo from '../assets/WDC.png';

function ViewProgressions() {
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

  return (
    <div className="view-progressions">
      <img src={logo} alt="Logo" className="logo" />
      <h1>Mentee Progress Reports</h1>
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
  );
}

export default ViewProgressions;
