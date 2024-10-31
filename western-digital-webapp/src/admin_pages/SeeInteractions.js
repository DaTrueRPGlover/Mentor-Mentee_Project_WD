import React, { useState } from 'react';
import './SeeInteractions.css';
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

  return (
    <div className="see-interactions">
      <img src={logo} alt="Logo" className="logo" />
      <h1>Viewing Interactions</h1>
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
      
      {/* Move the rectangle below everything */}
      <div className="rectangle">
      </div>
    </div>
  );
}

export default SeeInteractions;
