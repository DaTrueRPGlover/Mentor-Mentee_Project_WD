import React, { useState, useEffect } from 'react';
import './ViewProgression.css';
import { useNavigate } from "react-router-dom";
import logo from '../assets/WDC.png';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import MoodIcon from '@mui/icons-material/Mood';

function ViewProgressions() {
  const navigate = useNavigate();

  const [menteesList, setMenteesList] = useState([]);
  const [mentors, setMentorsList] = useState([]);
  const [newMentee, setNewMentee] = useState(null);
  const [menteeNotes, setMenteeNotes] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch mentee notes by meeting key and mentee key
  const fetchMenteeNotes = async (meetingkey, menteekey) => {
    try {
      const response = await fetch(`http://localhost:3001/api/menteenotes/${meetingkey}/${menteekey}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setMenteeNotes(data); // Set mentee notes state with the fetched data
        } else {
          setErrorMessage('No notes found for this meeting and mentee key.');
        }
      } else {
        setErrorMessage('Error fetching mentee notes');
      }
    } catch (error) {
      setErrorMessage('Error fetching mentee notes');
    }
  };

  // Fetch list of mentees
  const fetchMenteeNames = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/mentees');
      if (response.ok) {
        const data = await response.json();
        setMenteesList(data);
      } else {
        setErrorMessage('Error fetching mentee data');
      }
    } catch (error) {
      setErrorMessage('Error fetching mentee data');
    }
  };

  // Fetch list of mentors
  const fetchMentorNames = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/mentors');
      if (response.ok) {
        const data = await response.json();
        setMentorsList(data);
      } else {
        setErrorMessage('Error fetching mentor data');
      }
    } catch (error) {
      setErrorMessage('Error fetching mentor data');
    }
  };

  useEffect(() => {
    fetchMenteeNames();
    fetchMentorNames();
  }, []);

  useEffect(() => {
    if (newMentee && newMentee.meetingkey && newMentee.menteekey) {
      // Fetch mentee notes when a new mentee is selected
      fetchMenteeNotes(newMentee.meetingkey, newMentee.menteekey); // Pass both keys
    }
  }, [newMentee]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="todo-progression">
      <header className="header-container">
        <div className="top-header">
          <button className="logo-button" onClick={() => navigate("/admin-home")}>
            <img src={logo} alt="Logo" className="logo" />
          </button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        <div className="welcome-message-container">
          <h1 className="welcome-message">View Progression</h1>
        </div>
      </header>

      {/* Mentee selection */}
      <select
        value={newMentee ? newMentee.userid : ''}
        onChange={(e) => {
          const mentee = menteesList.find(m => m.userid === e.target.value);
          setNewMentee(mentee); // Update mentee and fetch its notes
        }}
      >
        <option value="">Select Mentee</option>
        {menteesList.map((mentee) => (
          <option key={mentee.userid} value={mentee.userid}>
            {mentee.name} {mentee.lastname}
          </option>
        ))}
      </select>

      <div className="content-split">
        <div className="form-section">
          {/* Display mentee notes */}
          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <EventBusyOutlinedIcon className="form-title-icon" />
                <p>Profile of a Leader</p>
              </div>
              <input
                type="number"
                value={menteeNotes ? menteeNotes.profile_of_a_leader : ''}
                readOnly
              />
            </div>
          </div>

          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
                <p>Executive Communication Style</p>
              </div>
              <input
                type="number"
                value={menteeNotes ? menteeNotes.executive_communication_style : ''}
                readOnly
              />
            </div>
          </div>

          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <MoodIcon className="form-title-icon" />
                <p>Trust, Respect, Visibility</p>
              </div>
              <input
                type="number"
                value={menteeNotes ? menteeNotes.trust_respect_visibility : ''}
                readOnly
              />
            </div>
          </div>

          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <MoodIcon className="form-title-icon" />
                <p>Motivating Your Team</p>
              </div>
              <input
                type="number"
                value={menteeNotes ? menteeNotes.motivating_your_team : ''}
                readOnly
              />
            </div>
          </div>

          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <MoodIcon className="form-title-icon" />
                <p>Self Advocacy and Career Growth</p>
              </div>
              <input
                type="number"
                value={menteeNotes ? menteeNotes.self_advocacy_and_career_growth : ''}
                readOnly
              />
            </div>
          </div>

          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <MoodIcon className="form-title-icon" />
                <p>Work Life Balance</p>
              </div>
              <input
                type="number"
                value={menteeNotes ? menteeNotes.work_life_balance : ''}
                readOnly
              />
            </div>
          </div>

          {/* // */}
        </div>
      </div>
    </div>
  );
}

export default ViewProgressions;
