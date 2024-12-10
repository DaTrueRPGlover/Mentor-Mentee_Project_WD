// src/components/InteractWithMentor.js
import React, { useState, useEffect } from "react";
import "./InteractWithMentor.css";
import logo from "../assets/WDC2.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import assign from "../assets/assign.png";
import calendar from "../assets/calendar.png";
import logout from "../assets/logout.png";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Importing motion
import ChatBox from "./ChatBox"; // Import the ChatBox component
import CheckHWTable from "./CheckHWTable"; // Import the CheckHWTable component

function InteractWithMentor() {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const user = JSON.parse(sessionStorage.getItem("user"));
  const name = user['name']
  console.log(user);
  console.log(name)
  const menteeName = name|| "Mentee";

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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

  return (
    <div className="interact-with-mentor">

      <div className="logo-title-container">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="title-header">Chat With Mentor</h1>
      </div>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Navigation Buttons */}
        <div className="nav-buttons">
          <motion.button
            className="icon1"
            onClick={() => navigate("/interact-mentor")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/todo-progression")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={write} alt="write" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/check-hw")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={assign} alt="assign" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/mentee-meetings")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={calendar} alt="calendar" />
          </motion.button>
        </div>

        {/* Dark Mode Toggle */}
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
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <img src={logout} alt="logout" />
        </motion.button>
      </div>

      {/* Content Wrapper for Welcome Message and Chat Box */}
      <div className="content-wrapperV2">
        {/* Chat Box */}
        <div className="chat-box">
          <div className="box">
            <ChatBox />
          </div>
        </div>
      </div>
      {/* Welcome and To-Do Boxes Container */}
      <div className="welcome-box-container">
        {/* Welcome Message Box */}
        <div className="welcome-box">
          <h2>Welcome, {menteeName}!</h2>
          <p>Today is {formatDateTime(currentDateTime)}</p>
        </div>

        {/* New Box under the Welcome Box */}
        <div className="new-box">
          <h2>To-Do</h2>
          <CheckHWTable /> {/* Insert CheckHWTable here */}
        </div>
      </div>
    </div>
  );
}

export default InteractWithMentor;
