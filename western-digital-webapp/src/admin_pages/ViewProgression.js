// ViewProgressions.js
import React, { useState, useEffect } from 'react';
import './ViewProgression.css';
import { useNavigate } from "react-router-dom";
import logout from "../assets/logout.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import one from "../assets/one.png";
import twopeople from "../assets/twopeople.png";
import logo from "../assets/WDC2.png";
import { motion } from "framer-motion"; // Importing motion
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import MoodIcon from '@mui/icons-material/Mood';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import AssignMentor from './AssignMentorTable.js';

function ViewProgressions() {
  const navigate = useNavigate();

  const [menteesList, setMenteesList] = useState([]);
  const [meetingsList, setMeetingsList] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState('');
  const [menteeNotes, setMenteeNotes] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');


  const [mentorsList, setMentorsList] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [mentorNotes, setMentorNotes] = useState(null);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const name = user['name']
  const adminName = name || "Admin";
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.className = isDarkMode ? "" : "dark-mode";
  };
  // Fetch mentee notes by meeting key and mentee key
  const fetchMenteeNotes = async (meetingkey, menteekey) => {
    try {
      console.log("Mentee Key:", menteekey);
      console.log("Meeting Key:", meetingkey);
      const response = await fetch(`http://localhost:3001/api/menteeNotes/menteenotes/${meetingkey}/${menteekey}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setMenteeNotes(data);
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
  const fetchMentorNotes = async (meetingkey, mentorkey) => {
    try {
      console.log("Mentor Key:", mentorkey);
      console.log("Meeting Key:", meetingkey);
      const response = await fetch(`http://localhost:3001/api/mentorNotes/mentornotes/${meetingkey}/${mentorkey}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setMentorNotes(data); // Set mentee notes state with the fetched data
          setErrorMessage('');
        } else {
          setErrorMessage('No notes found for this meeting and mentee key.');
          setMentorNotes(null);
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error fetching mentor notes');
        setMentorNotes(null);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching mentor notes');
      setMentorNotes(null);
    }
  };
  const formatDateTime = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
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

  const fetchMentorNames = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/mentors');
      if (response.ok) {
        const data = await response.json();
        setMentorsList(data);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error fetching mentor data');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching mentor data');
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
  const fetchMeetingsByMentor = async (mentorkey) => {
    try {
      const response = await fetch(`http://localhost:3001/api/meetings/mentors/${mentorkey}`);
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
    fetchMentorNames();
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
    if (selectedMentor) {
      fetchMeetingsByMentor(selectedMentor);
      setSelectedMeeting(''); // Reset selected meeting when mentee changes
      setMentorNotes(null); // Clear previous notes
      setErrorMessage('');
    }
  }, [selectedMentor]);

  useEffect(() => {
    if (selectedMentee && selectedMeeting) {
      fetchMenteeNotes(selectedMeeting, selectedMentee);
    }
  }, [selectedMentee, selectedMeeting]);

  useEffect(() => {
    if (selectedMentor && selectedMeeting) {
      fetchMentorNotes(selectedMeeting, selectedMentor);
    }
  }, [selectedMentor, selectedMeeting]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="view-progression">
<div className="boxC">
    <div className="logo-title-container">
          <img src={logo} alt="logo" className="logo" />
          <h1 className="title-header">View Progress</h1>
    </div>
    <div className="sidebarC">
        {/* Navigation Buttons */}
        <div className="nav-buttonsC">
          <motion.button
            className="icon"
            onClick={() => navigate("/see-interactions")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button
            className="icon1"
            onClick={() => navigate("/view-progressions")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={write} alt="write" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/create-account")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={one} alt="create" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/assign-mentor")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={twopeople} alt="twopeople" />
          </motion.button>
        </div>

        {/* Logout Button */}
        <div className="slider-section">
          <span role="img" aria-label="Sun"></span>
          <label className="slider-container">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
          <span role="img" aria-label="Moon"></span>
        </div>
        <motion.button
          className="logout-buttonV2"
          onClick={handleLogout}
          whileHover={{ scale: 1.1 }} // Growing effect on hover
          transition={{ duration: 0.3 }}
        >
          <img src={logout} alt="logout" />
        </motion.button>
      </div>

      <div className="content-wrapperVA">
        <div className="chat-boxA">
          <div className="box1">
          <div className="chat-containerA">
          </div>
          <div className="main-content">
  {/* Mentor and Mentee Dropdowns Side by Side */}
  <div className="mentor-mentee-container">
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

    <div className="dropdown-container">
      <label htmlFor="mentor-select">Select Mentor:</label>
      <select
        id="mentor-select"
        value={selectedMentor}
        onChange={(e) => setSelectedMentor(e.target.value)}
      >
        <option value="">-- Select Mentor --</option>
        {mentorsList.map((mentor) => (
          <option key={mentor.userid} value={mentor.userid}>
            {mentor.name} {mentor.lastname}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Other Dropdowns Stacked Below */}
  <div className="smallrect">
  {selectedMentee && (
    <div className="dropdown-container">
      <label htmlFor="meeting-select-mentee">Select Meeting (Mentee):</label>
      <select
        id="meeting-select-mentee"
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

  {selectedMentor && (
    <div className="dropdown-container">
      <label htmlFor="meeting-select-mentor">Select Meeting (Mentor):</label>
      <select
        id="meeting-select-mentor"
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
  </div>



     
  {/* {errorMessage && <p className="error-message">{errorMessage}</p>} */}

      <div className="content-split">
        <div className="form-section">
          {/* Display mentee notes */}
          {menteeNotes && (
            <>
              <div className="form-box1">
                <div className="question-group">
                  <div className="form-title">
                    <EventBusyOutlinedIcon className="form-title-icon" />
                    <p>Profile of a Leader</p>
                  </div>
                  <input className='input1'
                    type="number"
                    value={menteeNotes.profile_of_a_leader}
                    readOnly
                  />
                </div>
              </div>

              <div className="form-box1">
                <div className="question-group">
                  <div className="form-title">
                    <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
                    <p>Executive Communication Style</p>
                  </div>
                  <input className='input1'
                    type="number"
                    value={menteeNotes.executive_communication_style}
                    readOnly
                  />
                </div>
              </div>

              <div className="form-box1">
                <div className="question-group">
                  <div className="form-title">
                    <MoodIcon className="form-title-icon" />
                    <p>Trust, Respect, Visibility</p>
                  </div>
                  <input className='input1'
                    type="number"
                    value={menteeNotes.trust_respect_visibility}
                    readOnly
                  />
                </div>
              </div>

              <div className="form-box1">
                <div className="question-group">
                  <div className="form-title">
                    <MoodIcon className="form-title-icon" />
                    <p>Motivating Your Team</p>
                  </div>
                  <input className='input1'
                    type="number"
                    value={menteeNotes.motivating_your_team}
                    readOnly
                  />
                </div>
              </div>

              <div className="form-box1">
                <div className="question-group">
                  <div className="form-title">
                    <MoodIcon className="form-title-icon" />
                    <p>Self Advocacy and Career Growth</p>
                  </div>
                  <input className='input1'
                    type="number"
                    value={menteeNotes.self_advocacy_and_career_growth}
                    readOnly
                  />
                </div>
              </div>

              <div className="form-box1">
                <div className="question-group">
                  <div className="form-title">
                    <MoodIcon className="form-title-icon" />
                    <p>Work Life Balance</p>
                  </div>
                  <input className='input1'
                    type="number"
                    value={menteeNotes.work_life_balance}
                    readOnly
                  />
                </div>
              </div>

              {/* Additional Comments */}
              {menteeNotes.additional_comments && (
                <div className="form-box1">
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
        {/* MENTOR FORM NOW  */}
        {mentorNotes && (
    <>
      <div className="form-box1">
        <div className="question-group">
          <div className="form-title">
            <EventBusyOutlinedIcon className="form-title-icon" />
            <p>Skipped Meeting?</p>
          </div>
          <input className='input1'
            type="number"
            value={mentorNotes.skipped}
            readOnly
          />
        </div>
      </div>

      <div className="form-box1">
        <div className="question-group">
          <div className="form-title">
            <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
            <p>Mentee Finished HW?</p>
          </div>
          <input className='input1'
            type="number"
            value={mentorNotes.finished_homework}
            readOnly
          />
        </div>
      </div>

      <div className="form-box1">
        <div className="question-group">
          <div className="form-title">
            <MoodIcon className="form-title-icon" />
            <p>Mentee's Attitude Towards Learning</p>
          </div>
          <input className='input1'
            type="number"
            value={mentorNotes.attitude_towards_learning}
            readOnly
          />
        </div>
      </div>

      {/* Additional Comments */}
      {mentorNotes.additional_comments && (
        <div className="form-box1">
          <div className="question-group">
            <div className="form-title">
              <p>Additional Comments</p>
            </div>
            <textarea
              className='textarea'
              value={mentorNotes.additional_comments}
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
        </div>
      </div>

      </div>
      <div className="welcome-box-containerA">
      {/* Welcome Message Box */}
      <div className="welcome-boxA">
        <h2>Welcome, {adminName}!</h2>
        <p>Today is {formatDateTime(currentDateTime)}</p>
      </div>

      <div className="new-boxA">
    <h2>To-Do</h2>
    <div className="assign-mentor-container">
      <AssignMentor/>
    </div>
  </div>
      
    </div>
    </div>
    
  );
}

export default ViewProgressions;
