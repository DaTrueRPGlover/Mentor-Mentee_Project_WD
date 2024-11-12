import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate

import './AssignHomework.css';
import logo from '../assets/WDC.png';

const menteesData = [
  { name: 'John Doe', skills: ['Profile of a leader', 'Work-Life Balance'] },
  { name: 'Jane Smith', skills: ['Executive Communication Style', 'Trust, Respect and Visibility'] },
  { name: 'Emily Johnson', skills: ['Motivating your team', 'Self-advocacy and your career growth'] },
  { name: 'Michael Brown', skills: ['Profile of a leader', 'Trust, Respect and Visibility'] },
];

const skillsList = [
  'Profile of a leader',
  'Executive Communication Style',
  'Trust, Respect and Visibility',
  'Motivating your team',
  'Self-advocacy and your career growth',
  'Work-Life Balance',
];

function AssignHomework() {
  const navigate = useNavigate(); // <-- Initialize navigate
  const [homeworkList, setHomeworkList] = useState([]);
  const [newHomework, setNewHomework] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentees, setSelectedMentees] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');

  const handleAddHomework = () => {
    if (newHomework.trim() && dueDate && selectedMentees.length > 0) {
      setHomeworkList([...homeworkList, { title: newHomework, dueDate, mentees: selectedMentees }]);
      setNewHomework('');
      setDueDate('');
      setSelectedMentees([]);
    }
  };

  const handleMenteeSelection = (mentee) => {
    if (selectedMentees.includes(mentee)) {
      setSelectedMentees(selectedMentees.filter(m => m !== mentee));
    } else {
      setSelectedMentees([...selectedMentees, mentee]);
    }
  };

  const filteredMentees = menteesData.filter(
    mentee =>
      mentee.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSkill ? mentee.skills.includes(selectedSkill) : true)
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="assign-hw">

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
        <h1 className="welcome-message">Assign Mentee Homework</h1>
      </header>
   
   
   <div className="homework-body">


      <div className="search-filter-container">
        <div className="search-container">
          <input
            type="text"
            className="homework-input"
            placeholder="Search for mentees"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <select
            className="homework-input"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="">All Skills</option>
            {skillsList.map(skill => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mentees-container">
        <div className="mentees-list">
          <h3>Available Mentees</h3>
          <ul>
            {filteredMentees.map(mentee => (
              <li key={mentee.name} onClick={() => handleMenteeSelection(mentee.name)}>
                {mentee.name} (Skills: {mentee.skills.join(', ')})
              </li>
            ))}
          </ul>
        </div>

        <div className="selected-mentees-list">
          <h3>Selected Mentees</h3>
          <ul>
            {selectedMentees.map(mentee => (
              <li key={mentee}>{mentee}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="date-picker-container">
        <input
          type="date"
          className="homework-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <textarea
        className="homework-input"
        placeholder="Enter homework task (paragraph length)"
        value={newHomework}
        onChange={(e) => setNewHomework(e.target.value)}
      />

      <button
        className="homework-button"
        onClick={handleAddHomework}
        disabled={!newHomework || !dueDate || selectedMentees.length === 0}
      >
        Assign Homework to Selected Mentees
      </button>
    </div>
    </div>
  );
}

export default AssignHomework;
