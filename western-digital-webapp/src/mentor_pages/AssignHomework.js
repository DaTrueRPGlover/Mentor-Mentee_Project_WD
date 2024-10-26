import React, { useState } from 'react';
import './AssignHomework.css';

function AssignHomework() {
  const [homeworkList, setHomeworkList] = useState([
    { title: 'Complete chapter 3 exercises', dueDate: '2024-10-25' },
    { title: 'Submit project proposal', dueDate: '2024-11-01' },
  ]);
  const [newHomework, setNewHomework] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleAddHomework = () => {
    if (newHomework.trim() && dueDate.trim()) {
      setHomeworkList([...homeworkList, { title: newHomework, dueDate }]);
      setNewHomework('');
      setDueDate('');
    }
  };

  return (
    <div className="assign-homework">
      <h1>Assign Homework</h1>
      <div className="homework-form">
        <input
          type="text"
          value={newHomework}
          onChange={(e) => setNewHomework(e.target.value)}
          placeholder="Enter homework task"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="Enter due date"
        />
        <button onClick={handleAddHomework}>Assign Homework</button>
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
