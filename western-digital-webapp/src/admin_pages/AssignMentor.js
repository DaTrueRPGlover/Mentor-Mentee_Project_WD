import React, { useState } from 'react';
import './AssignMentor.css';
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import logo from '../assets/WDC.png';

function AssignMentor() {
  const navigate = useNavigate(); // <-- Initialize navigate

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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="assign-mentor-container">
      <header className="header-container">
        <div className="top-header">
            <img src={logo} alt="Logo" className="logo" />

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h1 className="welcome-message">Assign Mentor To Mentee</h1>
      </header>

      <div className="content-container">
        <div className="rectangle">
          {/* Rectangle content if needed */}
        </div>

        <div className="assign-form">
          <ul>
            {mentees.map((mentee, index) => (
              <li key={index} className="mentee-list-item">
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
      </div>
    </div>
  );
}

export default AssignMentor;
