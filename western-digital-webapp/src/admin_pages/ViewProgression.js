import React, { useState, useEffect } from 'react';
import './ViewProgression.css';
import { useNavigate } from "react-router-dom";
import logo from '../assets/WDC.png';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import MoodIcon from '@mui/icons-material/Mood';

function ViewProgressions() {
  const navigate = useNavigate();

  const [progressReports, setProgressReports] = useState([]);
  const [newReport, setNewReport] = useState("");
  const [communication, setCommunication] = useState(""); 
  const [influence, setInfluence] = useState(""); 
  const [managingProjects, setManagingProjects] = useState(""); 
  const [innovation, setInnovation] = useState(""); 
  const [emotionalIntelligence, setEmotionalIntelligence] = useState("");
  const [decisionMaking, setDecisionMaking] = useState(""); 
  const [menteesList, setMenteesList] = useState([]);
  const [newMentee, setNewMentee] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [menteeNotes, setMenteeNotes] = useState(null);

  // Fetch mentee notes from the server for a specific mentee by meeting key
  const fetchMenteeNotes = async (meetingkey) => {
    try {
      const response = await fetch(`http://localhost:3001/api/menteenotes/${meetingkey}`);
      if (response.ok) {
        const data = await response.json();
        setMenteeNotes(data); // Store the fetched mentee notes
      } else {
        setErrorMessage('Error fetching mentee notes');
      }
    } catch (error) {
      setErrorMessage('Error fetching mentee notes');
    }
  };

  // Fetch mentee names from the server for the mentee dropdown list
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

  // Fetch mentee names on component mount
  useEffect(() => {
    fetchMenteeNames();
  }, []);

  // Re-fetch mentee notes when a new mentee is selected
  useEffect(() => {
    if (newMentee) {
      fetchMenteeNotes(newMentee.meetingkey);
    }
  }, [newMentee]); // Dependency array triggers this useEffect when newMentee changes

  // Add a new progress report for the selected mentee with relevant details
  const handleAddReport = () => {
    const newReportData = {
      notes: newReport,
      communication, 
      influence, 
      managingProjects, 
      innovation,
      emotionalIntelligence,
      decisionMaking,
    };

    console.log("New Report Submitted:", newReportData);

    setProgressReports([...progressReports, newReportData]);
    setNewReport(""); 
    setCommunication(""); 
    setInfluence(""); 
    setManagingProjects(""); 
    setInnovation("");
    setEmotionalIntelligence("");
    setDecisionMaking("");
  };

  // Log out
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    // main containers
    <div className="todo-progression">
      <header className="header-container">
        <div className="top-header">
          <button
            className="logo-button"
            onClick={() => navigate("/admin-home")}
          >
            <img src={logo} alt="Logo" className="logo" />
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="welcome-message-container">
          <h1 className="welcome-message">View Progression</h1>
        </div>
      </header>

      {/* Mentee Dropdown for selecting a mentee to view their progress */}
      <select
        value={newMentee ? newMentee.userid : ''}
        onChange={(e) => {
          const mentee = menteesList.find(m => m.userid === e.target.value);
          setNewMentee(mentee);
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
          {/* Communication Form */}
          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <EventBusyOutlinedIcon className="form-title-icon" />
                {/* <p>profile_of_a_leader</p> */}
                <p>Communication</p>
              </div>
              <input
                type="text"
                id="myInput"
                value={menteeNotes ? menteeNotes.profile_of_a_leader : ''}
                placeholder="1"
                onChange={(e) => setCommunication(e.target.value)}
              />
            </div>
          </div>

          {/* Influence Form */}
          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
                {/* <p>executive_communication_style</p> */}
                <p>Influence</p>
              </div>
              <input
                type="text"
                id="myInput"
                value={menteeNotes ? menteeNotes.executive_communication_style : ''}
                placeholder="1"
                onChange={(e) => setInfluence(e.target.value)}
              />
            </div>
          </div>

          {/* Managing Projects Form */}
          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <MoodIcon className="form-title-icon" />
                {/* <p>trust_respect_visibility</p> */}
                <p>Managing Projects</p>
              </div>
              <input
                type="text"
                id="myInput"
                value={menteeNotes ? menteeNotes.trust_respect_visibility : ''}
                placeholder="1"
                onChange={(e) => setManagingProjects(e.target.value)}
              />
            </div>
          </div>

          {/* Innovation Form */}
          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <MoodIcon className="form-title-icon" />
                {/* <p>motivating_your_team</p> */}
                <p>Innovation</p>
              </div>
              <input
                type="text"
                id="myInput"
                value={menteeNotes ? menteeNotes.motivating_your_team : ''}
                placeholder="1"
                onChange={(e) => setInnovation(e.target.value)}
              />
            </div>
          </div>

          {/* Emotional Intelligence Form */}
          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <MoodIcon className="form-title-icon" />
                {/* <p>self_advocacy_and_career_growth</p> */}
                <p>Emotional Intelligence</p>
              </div>
              <input
                type="text"
                id="myInput"
                value={menteeNotes ? menteeNotes.self_advocacy_and_career_growth : ''}
                placeholder="1"
                onChange={(e) => setEmotionalIntelligence(e.target.value)}
              />
            </div>
          </div>

          {/* Decision Making Form */}
          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <MoodIcon className="form-title-icon" />
                {/* <p>feedback_for_development</p> */}
                <p>Decision Making</p>
              </div>
              <input
                type="text"
                id="myInput"
                value={menteeNotes ? menteeNotes.feedback_for_development : ''}
                placeholder="1"
                onChange={(e) => setDecisionMaking(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProgressions;