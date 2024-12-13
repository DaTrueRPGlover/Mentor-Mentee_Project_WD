// src/components/TodoProgression.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TodoProgression.css";

import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import MoodIcon from "@mui/icons-material/Mood";
import { motion } from "framer-motion"; // Importing motion
import logo from "../assets/WDC2.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import assign from "../assets/assign.png";
import calendar from "../assets/calendar.png";
import logout from "../assets/logout.png";
import CheckHWTable from "./CheckHWTable"; // Import the CheckHWTable component

function TodoProgression() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const name = user['name']
  console.log(user);
  console.log(name)
  const menteeName = name|| "Mentee";

  const [communication, setCommunication] = useState(null);
  const [influence, setInfluence] = useState(null);
  const [managingProjects, setManagingProjects] = useState(null);
  const [innovation, setInnovation] = useState(null);
  const [emotionalIntelligence, setEmotionalIntelligence] = useState(null);
  const [decisionMaking, setDecisionMaking] = useState(null);
  const [error, setError] = useState(null);
  const [newReport, setNewReport] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.className = isDarkMode ? "" : "dark-mode";
  };

  useEffect(() => {
    // Retrieve the menteekey from sessionStorage
    const userInfo = JSON.parse(sessionStorage.getItem("user"));
    const menteeKey = userInfo?.menteekey;

    if (menteeKey) {
      fetch(`http://localhost:3001/api/menteenotes/meetings/${menteeKey}`)
        .then((response) => response.json())
        .then((data) => setMeetings(data))
        .catch((error) => console.error("Error fetching meetings:", error));
    } else {
      console.error("Menteekey not found in local storage.");
      setError("Menteekey not found.");
    }
  }, []);

  const ratingToScore = (rating) => {
    switch (rating) {
      case "Very Helpful":
        return 3;
      case "Somewhat Helpful":
        return 2;
      case "Not Helpful":
        return 1;
      default:
        return null;
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

  const handleAddReport = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(sessionStorage.getItem("user"));
    const menteeKey = userInfo?.menteekey;

    if (!menteeKey) {
      setError("Menteekey is missing. Please log in again.");
      return;
    }

    const newReportData = {
      meetingkey: selectedMeeting,
      menteekey: menteeKey, // Add menteekey to the data being sent
      notes: newReport,
      communication: ratingToScore(communication),
      influence: ratingToScore(influence),
      managingProjects: ratingToScore(managingProjects),
      innovation: ratingToScore(innovation),
      emotionalIntelligence: ratingToScore(emotionalIntelligence),
      decisionMaking: ratingToScore(decisionMaking),
    };

    try {
      const response = await fetch(
        "http://localhost:3001/api/menteenotes/menteenotes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReportData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Report added:", result);
        setNewReport("");
        setSelectedMeeting("");
        setCommunication(null);
        setInfluence(null);
        setManagingProjects(null);
        setInnovation(null);
        setEmotionalIntelligence(null);
        setDecisionMaking(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error pushing new report");
      }
    } catch (error) {
      console.error("Error pushing new report:", error);
      setError("Error pushing new report");
    }
  };
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="todo-progression">

      <div className="logo-title-container">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="title-header">Write Progression</h1>
      </div>
      <div className="sidebarA">
        {/* Navigation Buttons */}
        <div className="nav-buttonsA">
          <motion.button
            className="icon"
            onClick={() => navigate("/interact-mentor")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button
            className="icon1"
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
   
      <div className="content-wrapperVA">
        <div className="chat-boxA">
            <div className="box">
              <div className="main-content">

                <div className="dropdown-container">
                  <label htmlFor="meetingSelect">Select Meeting:</label>
                  <select
                    id="meetingSelect"
                    value={selectedMeeting}
                    onChange={(e) => setSelectedMeeting(e.target.value)}
                  >
                    <option value="">Choose a meeting</option>
                    {meetings.map((meeting) => (
                      <option key={meeting.meetingkey} value={meeting.meetingkey}>
                        {new Date(meeting.datetime).toLocaleString()}
                      </option>
                    ))}
                  </select>
              </div>
              
                  <div className="form-container">
                {/* Communication Section */}
                <div className="form-box">
                  <div className="question-group">
                    <div className="form-title">
                      <EventBusyOutlinedIcon className="form-title-icon" />
                      <p>Communication</p>
                    </div>
                    <div className="radio-options">

                      <input
                        type="radio"
                        id="communication-very-helpful"
                        name="communication"
                        value="Very Helpful"
                        checked={communication === "Very Helpful"}
                        onChange={(e) => setCommunication(e.target.value)}
                      />
                      <label htmlFor="communication-very-helpful">Very Helpful</label>

                      <input
                        type="radio"
                        id="communication-somewhat-helpful"
                        name="communication"
                        value="Somewhat Helpful"
                        checked={communication === "Somewhat Helpful"}
                        onChange={(e) => setCommunication(e.target.value)}
                      />
                      <label htmlFor="communication-somewhat-helpful">
                        Somewhat Helpful
                      </label>

                      <input
                        type="radio"
                        id="communication-not-good"
                        name="communication"
                        value="Not Helpful"
                        checked={communication === "Not Helpful"}
                        onChange={(e) => setCommunication(e.target.value)}
                      />
                      <label htmlFor="communication-not-good">Not Helpful</label>
                    </div>
                  </div>
                </div>

                {/* Influence Section */}
                <div className="form-box">
                  <div className="question-group">
                    <div className="form-title">
                      <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
                      <p>Influence</p>
                    </div>
                    <div className="radio-options">

                      <input
                        type="radio"
                        id="influence-very-helpful"
                        name="influence"
                        value="Very Helpful"
                        checked={influence === "Very Helpful"}
                        onChange={(e) => setInfluence(e.target.value)}
                      />
                      <label htmlFor="influence-very-helpful">Very Helpful</label>

                      <input
                        type="radio"
                        id="influence-somewhat-helpful"
                        name="influence"
                        value="Somewhat Helpful"
                        checked={influence === "Somewhat Helpful"}
                        onChange={(e) => setInfluence(e.target.value)}
                      />
                      <label htmlFor="influence-somewhat-helpful">
                        Somewhat Helpful
                      </label>

                      <input
                        type="radio"
                        id="influence-not-good"
                        name="influence"
                        value="Not Helpful"
                        checked={influence === "Not Helpful"}
                        onChange={(e) => setInfluence(e.target.value)}
                      />
                      <label htmlFor="influence-not-good">Not Helpful</label>
                    </div>
                  </div>
                </div>

                {/* Managing Projects Section */}
                <div className="form-box">
                  <div className="question-group">
                    <div className="form-title">
                      <MoodIcon className="form-title-icon" />
                      <p>Managing Projects</p>
                    </div>
                    <div className="radio-options">

                      <input
                        type="radio"
                        id="managingProjects-very-helpful"
                        name="managingProjects"
                        value="Very Helpful"
                        checked={managingProjects === "Very Helpful"}
                        onChange={(e) => setManagingProjects(e.target.value)}
                      />
                      <label htmlFor="managingProjects-very-helpful">
                        Very Helpful
                      </label>

                      <input
                        type="radio"
                        id="managingProjects-somewhat-helpful"
                        name="managingProjects"
                        value="Somewhat Helpful"
                        checked={managingProjects === "Somewhat Helpful"}
                        onChange={(e) => setManagingProjects(e.target.value)}
                      />
                      <label htmlFor="managingProjects-somewhat-helpful">
                        Somewhat Helpful
                      </label>

                      <input
                        type="radio"
                        id="managingProjects-not-good"
                        name="managingProjects"
                        value="Not Helpful"
                        checked={managingProjects === "Not Helpful"}
                        onChange={(e) => setManagingProjects(e.target.value)}
                      />
                      <label htmlFor="managingProjects-not-good">Not Helpful</label>
                    </div>
                  </div>
                </div>

                {/* Innovation Section */}
                <div className="form-box">
                  <div className="question-group">
                    <div className="form-title">
                      <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
                      <p>Innovation</p>
                    </div>
                    <div className="radio-options">

                      <input
                        type="radio"
                        id="innovation-very-helpful"
                        name="innovation"
                        value="Very Helpful"
                        checked={innovation === "Very Helpful"}
                        onChange={(e) => setInnovation(e.target.value)}
                      />
                      <label htmlFor="innovation-very-helpful">Very Helpful</label>

                      <input
                        type="radio"
                        id="innovation-somewhat-helpful"
                        name="innovation"
                        value="Somewhat Helpful"
                        checked={innovation === "Somewhat Helpful"}
                        onChange={(e) => setInnovation(e.target.value)}
                      />
                      <label htmlFor="innovation-somewhat-helpful">
                        Somewhat Helpful
                      </label>

                      <input
                        type="radio"
                        id="innovation-not-good"
                        name="innovation"
                        value="Not Helpful"
                        checked={innovation === "Not Helpful"}
                        onChange={(e) => setInnovation(e.target.value)}
                      />
                      <label htmlFor="innovation-not-good">Not Helpful</label>
                    </div>
                  </div>
                </div>

                {/* Emotional Intelligence Section */}
                <div className="form-box">
                  <div className="question-group">
                    <div className="form-title">
                      <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
                      <p>Emotional Intelligence</p>
                    </div>
                    <div className="radio-options">

                      <input
                        type="radio"
                        id="emotionalIntelligence-very-helpful"
                        name="emotionalIntelligence"
                        value="Very Helpful"
                        checked={emotionalIntelligence === "Very Helpful"}
                        onChange={(e) => setEmotionalIntelligence(e.target.value)}
                      />
                      <label htmlFor="emotionalIntelligence-very-helpful">
                        Very Helpful
                      </label>

                      <input
                        type="radio"
                        id="emotionalIntelligence-somewhat-helpful"
                        name="emotionalIntelligence"
                        value="Somewhat Helpful"
                        checked={emotionalIntelligence === "Somewhat Helpful"}
                        onChange={(e) => setEmotionalIntelligence(e.target.value)}
                      />
                      <label htmlFor="emotionalIntelligence-somewhat-helpful">
                        Somewhat Helpful
                      </label>

                      <input
                        type="radio"
                        id="emotionalIntelligence-not-good"
                        name="emotionalIntelligence"
                        value="Not Helpful"
                        checked={emotionalIntelligence === "Not Helpful"}
                        onChange={(e) => setEmotionalIntelligence(e.target.value)}
                      />
                      <label htmlFor="emotionalIntelligence-not-good">
                        Not Helpful
                      </label>
                    </div>
                  </div>
                </div>

                {/* Decision Making Section */}
                <div className="form-box">
                  <div className="question-group">
                    <div className="form-title">
                      <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
                      <p>Decision Making</p>
                    </div>
                    <div className="radio-options">

                      <input
                        type="radio"
                        id="decisionMaking-very-helpful"
                        name="decisionMaking"
                        value="Very Helpful"
                        checked={decisionMaking === "Very Helpful"}
                        onChange={(e) => setDecisionMaking(e.target.value)}
                      />
                      <label htmlFor="decisionMaking-very-helpful">Very Helpful</label>

                      <input
                        type="radio"
                        id="decisionMaking-somewhat-helpful"
                        name="decisionMaking"
                        value="Somewhat Helpful"
                        checked={decisionMaking === "Somewhat Helpful"}
                        onChange={(e) => setDecisionMaking(e.target.value)}
                      />
                      <label htmlFor="decisionMaking-somewhat-helpful">
                        Somewhat Helpful
                      </label>

                      <input
                        type="radio"
                        id="decisionMaking-not-good"
                        name="decisionMaking"
                        value="Not Helpful"
                        checked={decisionMaking === "Not Helpful"}
                        onChange={(e) => setDecisionMaking(e.target.value)}
                      />
                      <label htmlFor="decisionMaking-not-good">Not Helpful</label>
                    </div>
                  </div>
              </div>
              </div>

                <div className="comment-container">
                  <textarea
                    value={newReport}
                    onChange={(e) => setNewReport(e.target.value)}
                    placeholder="Extra comments here"
                  />
                  <button className="submit-button" onClick={handleAddReport}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
      {/* Welcome and To-Do Boxes Container */}
      <div className="welcome-box-containerA">
        {/* Welcome Message Box */}
        <div className="welcome-boxA">
          <h2>Welcome, {menteeName}!</h2>
          <p>Today is {formatDateTime(currentDateTime)}</p>
        </div>

        {/* New Box under the Welcome Box */}
        <div className="new-box">
        <h2>Upcoming Meetings/Homework</h2>
        <div className="check-hw-table-container">
          <CheckHWTable />
        </div>
      </div>
      </div>
    </div>
  );
};

export default TodoProgression;
