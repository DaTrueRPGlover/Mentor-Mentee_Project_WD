import React, { useState } from 'react';
import './WriteMenteeProgression.css';

function WriteMenteeProgression() {
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

  return (
    <div className="write-mentee-progression">
      <h1>Write Mentee Progression</h1>
      <ul>
        {progressReports.map((report, index) => (
          <li key={index}>
            <strong>{report.mentee}</strong> on {report.date}: {report.report}
          </li>
        ))}
      </ul>

      <h2>Add a New Progress Report</h2>
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
