import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './AssignHomework.css';
import logo from '../assets/WDC.png';

function AssignHomework() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedDate, setAssignedDate] = useState('');
  const [assignedTime, setAssignedTime] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [selectedMentees, setSelectedMentees] = useState([]);
  const [mentees, setMentees] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const mentorKey = userInfo.mentorkey;

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/relationships/mentees?mentorkey=${mentorKey}`);
        if (response.ok) {
          const menteesData = await response.json();
          setMentees(menteesData);
        } else {
          throw new Error('Failed to fetch mentees');
        }
      } catch (error) {
        console.error('Error fetching mentees:', error);
      }
    };
    fetchMentees();
  }, [mentorKey]);

  const handleAssignHomework = async () => {
    const homeworkData = {
      title,
      description,
      assignedDateTime: `${assignedDate}T${assignedTime}`,
      dueDateTime: `${dueDate}T${dueTime}`,
      mentees: selectedMentees,
      mentorKey,
    };
    try {
      const response = await fetch('http://localhost:3001/api/homework/assign-homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homeworkData),
      });
      if (response.ok) {
        alert('Homework assigned successfully!');
        setTitle('');
        setDescription('');
        setAssignedDate('');
        setAssignedTime('');
        setDueDate('');
        setDueTime('');
        setSelectedMentees([]);
      } else {
        throw new Error('Failed to assign homework');
      }
    } catch (error) {
      console.error('Error assigning homework:', error);
    }
  };

  const handleMenteeSelection = (menteeId) => {
    setSelectedMentees((prevSelected) =>
      prevSelected.includes(menteeId) ? prevSelected.filter((id) => id !== menteeId) : [...prevSelected, menteeId]
    );
  };

  return (
    <div className="assign-hw">
      <header className="header-container">
        <div className="top-header">
          <button className="logo-button" onClick={() => navigate("/mentor-home")}>
            <img src={logo} alt="Logo" className="logo" />
          </button>
          <button className="logout-button" onClick={() => navigate("/")}>Logout</button>
        </div>
        <h1 className="welcome-message">Assign Homework to Mentees</h1>
      </header>

      <div className="homework-body">
        <div className="homework-form">
          <input type="text" placeholder="Homework Title" value={title} onChange={(e) => setTitle(e.target.value)} className="homework-input title-input" />
          <textarea placeholder="Homework Description" value={description} onChange={(e) => setDescription(e.target.value)} className="homework-input description-input" />

          <div className="date-time-container">
            <label>Assigned Date and Time</label>
            <input type="date" value={assignedDate} onChange={(e) => setAssignedDate(e.target.value)} className="date-input" />
            <input type="time" value={assignedTime} onChange={(e) => setAssignedTime(e.target.value)} className="time-input" />
          </div>

          <div className="date-time-container">
            <label>Due Date and Time</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="date-input" />
            <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="time-input" />
          </div>

          <div className="mentees-container">
            <h3>Select Mentees</h3>
            <div className="mentee-list">
              {mentees.map((mentee) => (
                <div key={mentee.menteekey} className="mentee-item">
                  <label>
                    <input type="checkbox" checked={selectedMentees.includes(mentee.menteekey)} onChange={() => handleMenteeSelection(mentee.menteekey)} />
                    {mentee.menteeName}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleAssignHomework} disabled={!title || !description || !assignedDate || !assignedTime || !dueDate || !dueTime || selectedMentees.length === 0} className="homework-button">Assign Homework</button>
        </div>
      </div>
    </div>
  );
}

export default AssignHomework;
