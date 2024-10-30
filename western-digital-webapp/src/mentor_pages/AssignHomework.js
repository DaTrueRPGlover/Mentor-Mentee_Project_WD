import React, { useState } from 'react';
import './AssignHomework.css';
import WDCLogo from '../assets/WDC.png'

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
  const [homeworkList, setHomeworkList] = useState([
    { title: 'Complete chapter 3 exercises', dueDate: '2024-10-25' },
    { title: 'Submit project proposal', dueDate: '2024-11-01' },
  ]);
  const [newHomework, setNewHomework] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentees, setSelectedMentees] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');

  const handleAddHomework = () => {
    if (newHomework.trim() && dueDate.trim() && selectedMentees.length > 0) {
      setHomeworkList([...homeworkList, { title: newHomework, dueDate }]);
      setNewHomework('');
      setDueDate('');
      // Reset mentees selection after homework is assigned
      setSelectedMentees([]);
    }
  };

  const handleMenteeSelection = (menteeName) => {
    setSelectedMentees((prevSelected) =>
      prevSelected.includes(menteeName)
        ? prevSelected.filter((name) => name !== menteeName)
        : [...prevSelected, menteeName]
    );
  };

  const filteredMentees = menteesData.filter(
    (mentee) =>
      mentee.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSkill ? mentee.skills.includes(selectedSkill) : true)
  );

  return (
    <div className="homework-body">
      <img src={WDCLogo} alt="Company Logo" className="homework-logo" />

      <h1>Assign Homework</h1>
      <div className="homework-form">
        <input
          type="text"
          className="homework-input"
          value={newHomework}
          onChange={(e) => setNewHomework(e.target.value)}
          placeholder="Enter homework task"
        />
        <input
          type="date"
          className="homework-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        
        <h3>Select Mentees</h3>
        <input
          type="text"
          className="homework-input"
          placeholder="Search for mentees"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <h4>Filter by Skill</h4>
        <select
          className="homework-input"
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        >
          <option value="">All Skills</option>
          {skillsList.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>

        <ul>
          {filteredMentees.map((mentee) => (
            <li key={mentee.name}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedMentees.includes(mentee.name)}
                  onChange={() => handleMenteeSelection(mentee.name)}
                />
                {mentee.name} (Skills: {mentee.skills.join(', ')})
              </label>
            </li>
          ))}
        </ul>

        <button className="homework-button" onClick={handleAddHomework}>
          Assign Homework to Selected Mentees
        </button>
      </div>

      <h2>Assigned Homework</h2>
      <ul>
        {homeworkList.map((homework, index) => (
          <li key={index}>
            {homework.title} - Due by {homework.dueDate}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AssignHomework;
