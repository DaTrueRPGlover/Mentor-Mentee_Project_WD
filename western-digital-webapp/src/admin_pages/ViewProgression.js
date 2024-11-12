// ViewProgressions.js
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
  const [meetingsList, setMeetingsList] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState('');
  const [menteeNotes, setMenteeNotes] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch mentee notes by meeting key and mentee key
  const fetchMenteeNotes = async (meetingkey, menteekey) => {
    try {
      console.log("Mentee Key:", menteekey);
      console.log("Meeting Key:", meetingkey);
      const response = await fetch(`http://localhost:3001/api/menteeNotes/menteenotes/${meetingkey}/${menteekey}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setMenteeNotes(data); // Set mentee notes state with the fetched data
          setErrorMessage('');
        } else {
          setErrorMessage('No notes found for this meeting and mentee key.');
          setMenteeNotes(null);
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error fetching mentee notes');
        setMenteeNotes(null);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching mentee notes');
      setMenteeNotes(null);
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
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error fetching mentee data');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching mentee data');
    }
  };

  // Fetch meetings for a selected mentee
  const fetchMeetingsByMentee = async (menteekey) => {
    try {
      const response = await fetch(`http://localhost:3001/api/meetings/mentees/${menteekey}`);
      if (response.ok) {
        const data = await response.json();
        setMeetingsList(data);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error fetching meetings data');
        setMeetingsList([]);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching meetings data');
      setMeetingsList([]);
    }
  };

  useEffect(() => {
    fetchMenteeNames();
  }, []);

  useEffect(() => {
    if (selectedMentee) {
      fetchMeetingsByMentee(selectedMentee);
      setSelectedMeeting(''); // Reset selected meeting when mentee changes
      setMenteeNotes(null); // Clear previous notes
      setErrorMessage('');
    }
  }, [selectedMentee]);

  useEffect(() => {
    if (selectedMentee && selectedMeeting) {
      fetchMenteeNotes(selectedMeeting, selectedMentee);
    }
  }, [selectedMentee, selectedMeeting]);

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
      <div className="dropdown-container">
        <label htmlFor="mentee-select">Select Mentee:</label>
        <select
          id="mentee-select"
          value={selectedMentee}
          onChange={(e) => setSelectedMentee(e.target.value)}
        >
          <option value="">-- Select Mentee --</option>
          {menteesList.map((mentee) => (
            <option key={mentee.userid} value={mentee.userid}>
              {mentee.name} {mentee.lastname}
            </option>
          ))}
        </select>
      </div>

      {/* Meeting selection */}
      {selectedMentee && (
        <div className="dropdown-container">
          <label htmlFor="meeting-select">Select Meeting:</label>
          <select
            id="meeting-select"
            value={selectedMeeting}
            onChange={(e) => setSelectedMeeting(e.target.value)}
          >
            <option value="">-- Select Meeting --</option>
            {meetingsList.map((meeting) => (
              <option key={meeting.meetingkey} value={meeting.meetingkey}>
                {new Date(meeting.datetime).toLocaleString()} {/* Display readable date */}
              </option>
            ))}
          </select>
        </div>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="content-split">
        <div className="form-section">
          {/* Display mentee notes */}
          {menteeNotes && (
            <>
              <div className="form-box">
                <div className="question-group">
                  <div className="form-title">
                    <EventBusyOutlinedIcon className="form-title-icon" />
                    <p>Profile of a Leader</p>
                  </div>
                  <input
                    type="number"
                    value={menteeNotes.profile_of_a_leader}
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
                    value={menteeNotes.executive_communication_style}
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
                    value={menteeNotes.trust_respect_visibility}
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
                    value={menteeNotes.motivating_your_team}
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
                    value={menteeNotes.self_advocacy_and_career_growth}
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
                    value={menteeNotes.work_life_balance}
                    readOnly
                  />
                </div>
              </div>

              {/* Additional Comments */}
              {menteeNotes.additional_comments && (
                <div className="form-box">
                  <div className="question-group">
                    <div className="form-title">
                      <p>Additional Comments</p>
                    </div>
                    <textarea
                      value={menteeNotes.additional_comments}
                      readOnly
                      rows="4"
                      cols="50"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewProgressions;
