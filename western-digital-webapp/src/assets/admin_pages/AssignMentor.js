import React, { useState } from 'react';
import './AssignMentor.css';

function AssignMentor() {
  const [mentees, setMentees] = useState([
    { mentee: 'Jane Smith', mentor: 'John Doe' },
    { mentee: 'Mark White', mentor: 'Alice Brown' },
  ]);

  const [newMentee, setNewMentee] = useState('');
  const [newMentor, setNewMentor] = useState('');

  const handleAssignMentor = () => {
    if (newMentee.trim() && newMentor.trim()) {
      setMentees([...mentees, { mentee: newMentee, mentor: newMentor }]);
      setNewMentee(''); // Clear the input fields after adding
      setNewMentor('');
    }
  };

  const handleUpdateMentor = (index) => {
    const updatedMentees = mentees.map((mentee, i) =>
      i === index ? { ...mentee, mentor: newMentor } : mentee
    );
    setMentees(updatedMentees);
  };

  return (
    <div className="assign-mentor">
      <h1>Assign Mentor to Mentee</h1>
      <ul>
        {mentees.map((mentee, index) => (
          <li key={index}>
            {mentee.mentee} is mentored by <strong>{mentee.mentor}</strong>
            <input
              type="text"
              placeholder="Update mentor"
              onChange={(e) => setNewMentor(e.target.value)}
            />
            <button onClick={() => handleUpdateMentor(index)}>Update Mentor</button>
          </li>
        ))}
      </ul>
      <div className="add-assignment">
        <input
          type="text"
          value={newMentee}
          onChange={(e) => setNewMentee(e.target.value)}
          placeholder="Enter mentee name"
        />
        <input
          type="text"
          value={newMentor}
          onChange={(e) => setNewMentor(e.target.value)}
          placeholder="Enter mentor name"
        />
        <button onClick={handleAssignMentor}>Assign Mentor</button>
      </div>
    </div>
  );
}

export default AssignMentor;

