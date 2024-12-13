import React, { useState, useEffect } from "react";
import logout from "../assets/logout.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import one from "../assets/one.png";
import twopeople from "../assets/twopeople.png";
import { useNavigate } from "react-router-dom";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  ConversationHeader,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import "./SeeInteractions.css";
import logo from "../assets/WDC2.png";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { motion } from "framer-motion"; // Importing motion
import AssignMentorTable from "./AssignMentorTable.js";

function SeeInteractions() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedMentee, setSelectedMentee] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const name = user['name']
  const adminName = name || "Admin";
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
  useEffect(() => {
    // Fetch mentors and mentees
    fetch("http://localhost:3001/api/mentors")
      .then((response) => response.json())
      .then((data) => setMentors(data))
      .catch((error) => console.error("Error fetching mentors:", error));

    fetch("http://localhost:3001/api/mentees")
      .then((response) => response.json())
      .then((data) => setMentees(data))
      .catch((error) => console.error("Error fetching mentees:", error));
  }, []);

  useEffect(() => {
    if (!selectedMentor || !selectedMentee) return;

    // Fetch messages when mentor and mentee are selected
    fetch(
      `http://localhost:3001/api/messages?mentorkey=${selectedMentor}&menteekey=${selectedMentee}`
    )
      .then((response) => response.json())
      .then(({ messages }) => {
        const formattedMessages = messages.map((msg) => ({
          sender: msg.sender_role === "mentee" ? "Mentee" : "Mentor",
          content: msg.message_text,
          timestamp: new Date(msg.message_time).toLocaleString(),
        }));
        setMessages(formattedMessages);
      })
      .catch((error) => console.error("Error fetching messages:", error));
  }, [selectedMentor, selectedMentee]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="see-interactions">
      <div className="logo-title-container">
          <img src={logo} alt="logo" className="logo" />
          <h1 className="title-header">View Interactions</h1>
      </div>
      <div className="sidebarA">
        {/* Navigation Buttons */}
        <div className="nav-buttonsA">
          <motion.button
            className="icon1"
            onClick={() => navigate("/see-interactions")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button
            className="icon"
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
              <div className="search">



            <div className="filter-section">
              <label>Select Mentor: </label>
              <select className="drop"
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
              <div>

              </div>

              <label>Select Mentee: </label>
              <select className="drop"
                value={selectedMentee}
                onChange={(e) => setSelectedMentee(e.target.value)}
              >
                <option value="" disabled>
                  -- Select a mentee --
                </option>
                {mentees.map((mentee) => (
                  <option key={mentee.userid} value={mentee.userid}>
                    {mentee.name}
                  </option>
                ))}
              </select>
            </div>





          </div>
          </div>
          {selectedMentor && selectedMentee && (
              <MainContainer className="chat-container" style={{ backgroundColor: '#b9bec0', border: 'none', outline: 'none' }}>
                <ChatContainer style={{ backgroundColor: '#b9bec0' }}>

            <MessageList style={{ backgroundColor: '#b9bec0' }}>
              {messages.map((message, index) => (
                <Message
                  key={index}
                  model={{
                    message: message.content,
                    sentTime: message.timestamp,
                    sender: message.sender,
                    direction:
                      message.sender === "Mentor" ? "outgoing" : "incoming",
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
      </div>


      <div className="welcome-box-containerA">
  {/* Welcome Message Box */}
  <div className="welcome-boxA">
    <h2>Welcome, {adminName}!</h2>
    <p>Today is {formatDateTime(currentDateTime)}</p>
  </div>

  {/* New Box under the Welcome Box */}
  <div className="new-boxA">
    <h2>To-Do</h2>
    <div className="assign-mentor-container" >
      <AssignMentorTable     style={{
    margin: "0 auto", // Centers the table horizontally (removes any left margin)
    textAlign: "center",
    width: "80%", // Optional: Adjust the table's width
    borderCollapse: "collapse",
  }}/>
    </div>
  </div>
</div>


    </div>
  );
}

export default SeeInteractions;
