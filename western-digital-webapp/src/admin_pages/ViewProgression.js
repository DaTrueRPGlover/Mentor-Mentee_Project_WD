// src/pages/ViewProgressions.js

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
import AssignMentorTable from "./AssignMentorTable.js"; // Import the new component

function ViewProgressions() {
  const navigate = useNavigate();

  // State and handler logic remains the same...

  // (Retain the existing logic from your original ViewProgressions.js)
  // For brevity, I'm omitting the unchanged parts. Ensure to include all existing logic.

  // ... [Existing state and functions]

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

  // Fetching functions...

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

          {/* Theme Toggle */}
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

          {/* Logout Button */}
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
                {/* Main View Progressions Content */}
                {/* Include your existing ViewProgressions content here */}
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

          {/* To-Do Placeholder with AssignMentorTable */}
          <div className="new-boxA">
            <h2>To-Do</h2>
            <AssignMentorTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProgressions;
