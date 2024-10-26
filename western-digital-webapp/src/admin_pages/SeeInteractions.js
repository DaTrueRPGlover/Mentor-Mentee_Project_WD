import React, { useState } from 'react';
import './SeeInteractions.css';

function SeeInteractions() {
  const [interactions] = useState([
    { mentor: 'John Doe', mentee: 'Jane Smith', date: '2024-10-15', description: 'Reviewed project progress' },
    { mentor: 'Alice Brown', mentee: 'Mark White', date: '2024-10-16', description: 'Discussed new assignment' },
    { mentor: 'John Doe', mentee: 'Mark White', date: '2024-10-17', description: 'Provided feedback on homework' },
  ]);

  const [filter, setFilter] = useState('');

  const filteredInteractions = interactions.filter(
    interaction =>
      interaction.mentor.toLowerCase().includes(filter.toLowerCase()) ||
      interaction.mentee.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="see-interactions">
      <h1>Mentor-Mentee Interactions</h1>
      <input
        type="text"
        placeholder="Filter by mentor or mentee"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
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
