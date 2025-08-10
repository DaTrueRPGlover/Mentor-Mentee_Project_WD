// Finished
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
} from "@chatscope/chat-ui-kit-react";
import { motion } from "framer-motion";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";

import logo from "../assets/WDC2.png";
import logout from "../assets/logout.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import one from "../assets/one.png";
import twopeople from "../assets/twopeople.png";

import AssignMentorTable from "./AssignMentorTable.js";
import "./SeeInteractions.css";

function SeeInteractions() {
  const navigate = useNavigate();

  // State
  const [messages, setMessages] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedMentee, setSelectedMentee] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // User info
  const user = JSON.parse(sessionStorage.getItem("user"));
  const adminName = user?.name || "Admin";

  // Toggle dark mode
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.body.className = newTheme ? "dark-mode" : "";
    sessionStorage.setItem("isDarkMode", newTheme);
  };

  // Load dark mode preference
  useEffect(() => {
    const savedTheme = sessionStorage.getItem("isDarkMode") === "true";
    setIsDarkMode(savedTheme);
    document.body.className = savedTheme ? "dark-mode" : "";
  }, []);

  // Format date
  const formatDateTime = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Fetch mentors & mentees
  useEffect(() => {
    fetch("http://localhost:3001/api/mentors")
      .then((res) => res.json())
      .then(setMentors)
      .catch((err) => console.error("Error fetching mentors:", err));

    fetch("http://localhost:3001/api/mentees")
      .then((res) => res.json())
      .then(setMentees)
      .catch((err) => console.error("Error fetching mentees:", err));
  }, []);

  // Fetch messages for selected mentor/mentee
  useEffect(() => {
    if (!selectedMentor || !selectedMentee) return;

    fetch(
      `http://localhost:3001/api/messages?mentorkey=${selectedMentor}&menteekey=${selectedMentee}`
    )
      .then((res) => res.json())
      .then(({ messages }) => {
        const formatted = messages.map((msg) => ({
          sender: msg.sender_role === "mentee" ? "Mentee" : "Mentor",
          content: msg.message_text,
          timestamp: new Date(msg.message_time).toLocaleString(),
        }));
        setMessages(formatted);
      })
      .catch((err) => console.error("Error fetching messages:", err));
  }, [selectedMentor, selectedMentee]);

  // Logout
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="see-interactions">
      {/* Header */}
      <div className="logo-title-container">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="title-header">View Interactions</h1>
      </div>

      {/* Sidebar */}
      <div className="sidebarA">
        <div className="nav-buttonsA">
          <motion.button
            className="icon1"
            onClick={() => navigate("/see-interactions")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/view-progressions")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={write} alt="write" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/create-account")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={one} alt="create" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/assign-mentor")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={twopeople} alt="assign mentor" />
          </motion.button>
        </div>

        {/* Theme Toggle */}
        <div className="slider-section">
          <label className="slider-container">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Logout */}
        <motion.button
          className="logout-buttonV2"
          onClick={handleLogout}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <img src={logout} alt="logout" />
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="content-wrapperVA">
        <div className="chat-boxA">
          {/* Filters */}
          <div className="filter-section">
            <label>Select Mentor: </label>
            <select
              className="drop"
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
            >
              <option value="" disabled>
                -- Select Mentor --
              </option>
              {mentors.map((mentor) => (
                <option key={mentor.userid} value={mentor.userid}>
                  {mentor.name}
                </option>
              ))}
            </select>

            <label>Select Mentee: </label>
            <select
              className="drop"
              value={selectedMentee}
              onChange={(e) => setSelectedMentee(e.target.value)}
            >
              <option value="" disabled>
                -- Select Mentee --
              </option>
              {mentees.map((mentee) => (
                <option key={mentee.userid} value={mentee.userid}>
                  {mentee.name}
                </option>
              ))}
            </select>
          </div>

          {/* Messages */}
          {selectedMentor && selectedMentee && (
            <MainContainer
              className="chat-container"
              style={{ backgroundColor: "#b9bec0", border: "none" }}
            >
              <ChatContainer style={{ backgroundColor: "#b9bec0" }}>
                <MessageList style={{ backgroundColor: "#b9bec0" }}>
                  {messages.map((message, index) => (
                    <Message
                      key={index}
                      model={{
                        message: message.content,
                        sentTime: message.timestamp,
                        sender: message.sender,
                        direction:
                          message.sender === "Mentor"
                            ? "outgoing"
                            : "incoming",
                        position: "normal",
                      }}
                    />
                  ))}
                </MessageList>
              </ChatContainer>
            </MainContainer>
          )}
        </div>
      </div>

      {/* Side Info Boxes */}
      <div className="welcome-box-containerA">
        <div className="welcome-boxA">
          <h2>Welcome, {adminName}!</h2>
          <p>Today is {formatDateTime(currentDateTime)}</p>
        </div>

        <div className="new-boxA">
          <h2>To-Do</h2>
          <div className="assign-mentor-container">
            <AssignMentorTable
              style={{
                margin: "0 auto",
                textAlign: "center",
                width: "80%",
                borderCollapse: "collapse",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeeInteractions;
