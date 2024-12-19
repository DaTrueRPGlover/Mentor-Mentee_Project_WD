// src/components/WriteMenteeProgression.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WriteMenteeProgression.css";
import logo from "../assets/WDC2.png";
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import MoodIcon from '@mui/icons-material/Mood';
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import twopeople from "../assets/twopeople.png";
import logout from "../assets/logout.png";
import hw from "../assets/hw.png";
import calendar from "../assets/calendar.png";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion"; // Importing motion
import AssignHWTable from "./AssignHW.js"; // Import the AssignHWTable component

function WriteMenteeProgression() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);  // Initialize as an array
  const [selectedMeeting, setSelectedMeeting] = useState("");
  const [selectedMentee, setSelectedMentee] = useState("");
  const [skipped, setSkipped] = useState(null);
  const [finished_homework, setFinishedHomework] = useState(null);
  const [attitude_towards_learning, setAttitudeTowardsLearning] = useState(null);
  const [newReport, setNewReport] = useState("");
  const [mentees, setMentees] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const name = user['name']
  const mentorName = name || "Mentor";
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [errors, setErrors] = useState({}); // State for error messages
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.body.className = newTheme ? "dark-mode" : "";
    sessionStorage.setItem("isDarkMode", newTheme); // Save state
  };
  
  useEffect(() => {
    const savedTheme = sessionStorage.getItem("isDarkMode") === "true"; // Retrieve state
    setIsDarkMode(savedTheme);
    document.body.className = savedTheme ? "dark-mode" : "";
  }, []);
  

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("user"));
    const mentorKey = userInfo?.mentorkey;

    if (mentorKey) {
      fetch(`http://localhost:3001/api/relationships/mentees?mentorkey=${mentorKey}`)
        .then((response) => response.json())
        .then((data) => setMentees(data || []))  // Ensure mentees is always an array
        .catch((error) => console.error("Error fetching mentees:", error));
    }
  }, []);

  useEffect(() => {
    if (selectedMentee) {
      const userInfo = JSON.parse(sessionStorage.getItem("user"));
      const mentorKey = userInfo?.mentorkey;

      fetch(`http://localhost:3001/api/mentornotes/meetings/${mentorKey}/${selectedMentee}`)
        .then((response) => response.json())
        .then((data) => setMeetings(Array.isArray(data) ? data : []))  // Ensure meetings is an array
        .catch((error) => console.error("Error fetching meetings:", error));
    } else {
      setMeetings([]); // Clear meetings if no mentee is selected
    }
  }, [selectedMentee]);

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

    // Validate form before submission
    const validationErrors = {};
    if (!selectedMentee) validationErrors.selectedMentee = "Mentee is required.";
    if (!selectedMeeting) validationErrors.selectedMeeting = "Meeting is required.";
    if (skipped === null) validationErrors.skipped = "Please indicate if the meeting was skipped.";
    if (finished_homework === null) validationErrors.finished_homework = "Please indicate if homework was finished.";
    if (attitude_towards_learning === null) validationErrors.attitude_towards_learning = "Please select attitude towards learning.";
    if (!newReport.trim()) validationErrors.newReport = "Additional comments are required.";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // There are validation errors
      // Generate a summary message
      const missingFields = Object.values(validationErrors).join(" ");
      return;
    }

    const userInfo = JSON.parse(sessionStorage.getItem("user"));
    const mentorkey = userInfo?.mentorkey;

    if (!mentorkey) {
      console.error("mentorkey is missing. Please log in again.");
      return;
    }

    const newReportData = {
      meetingkey: selectedMeeting,
      mentorkey: mentorkey,
      skipped: skipped === "yes" ? 2 : 1,
      finished_homework: finished_homework === "yes" ? 2 : 1,
      attitude_towards_learning: 
        attitude_towards_learning === "very_good" ? 3 : attitude_towards_learning === "good" ? 2 : 1,
      additional_comments: newReport, 
    };

    try {
      const response = await fetch("http://localhost:3001/api/mentornotes/mentornotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReportData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Report added:", result);
        // Reset form
        setNewReport("");
        setSelectedMeeting("");
        setSkipped(null);
        setFinishedHomework(null);
        setAttitudeTowardsLearning(null);
        setErrors({});
       
      } else {
        console.error("Error pushing new report");
        const errorData = await response.json();

      }
    } catch (error) {
      console.error("Error pushing new report:", error);

    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };



  // Determine if the form is valid
  const isFormValid = selectedMentee && selectedMeeting && skipped !== null && finished_homework !== null && attitude_towards_learning !== null && newReport.trim();

  return (
    <div className="write-mentee-progression">
      <div className="logo-title-container">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="title-header">Write Mentee Progression</h1>
      </div>
      <div className="sidebarA">
        {/* Navigation Buttons */}
        <div className="nav-buttonsA">
          <motion.button
            className="icon"
            onClick={() => navigate("/interact-with-mentee")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button
            className="icon1"
            onClick={() => navigate("/write-mentee-progression")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={write} alt="write" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/assign-homework")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={hw} alt="create" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/mentor-meetings")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={calendar} alt="twopeople" />
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
            <div className="box">
              {/* Mentee Dropdown */}
              <div className="main-content">
                <div className="mentor-mentee-container">
                  <div className="dropdown-container">
                    <label>Select a Mentee:</label>
                    <select
                      value={selectedMentee}
                      onChange={(e) => setSelectedMentee(e.target.value)}
                    >
                      <option value="" disabled>Select a mentee</option>
                      {mentees.map((mentee) => (
                        <option key={mentee.menteekey} value={mentee.menteekey}>
                          {mentee.menteeName}
                        </option>
                      ))}
                    </select>
                    {errors.selectedMentee && <span className="error">{errors.selectedMentee}</span>}
                  </div>

                  {/* Meetings Dropdown */}
                  <div className="dropdown-container">
                    <label htmlFor="meetingSelect">Select Meeting:</label>
                    <select
                      id="meetingSelect"
                      value={selectedMeeting}
                      onChange={(e) => setSelectedMeeting(e.target.value)}
                      disabled={!selectedMentee}
                    >
                      <option value="">Choose a meeting</option>
                      {meetings.map((meeting) => (
                        <option key={meeting.meetingkey} value={meeting.meetingkey}>
                          {new Date(meeting.datetime).toLocaleString()}
                        </option>
                      ))}
                    </select>
                    {errors.selectedMeeting && <span className="error">{errors.selectedMeeting}</span>}
                  </div>
                </div>

                {/* Skipped Section */}
                <div className="form-box">
                  <div className="question-group">
                    <div className="form-title">
                      <EventBusyOutlinedIcon className="form-title-icon" />
                      <p>Skipped</p>
                    </div>
                    <div className="radio-options">
                      <input
                        type="radio"
                        id="skipped-yes"
                        name="skipped"
                        value="yes"
                        checked={skipped === "yes"}
                        onChange={(e) => setSkipped(e.target.value)}
                      />
                      <label htmlFor="skipped-yes">Yes</label>

                      <input
                        type="radio"
                        id="skipped-no"
                        name="skipped"
                        value="no"
                        checked={skipped === "no"}
                        onChange={(e) => setSkipped(e.target.value)}
                      />
                      <label htmlFor="skipped-no">No</label>
                    </div>
                    {errors.skipped && <span className="error">{errors.skipped}</span>}
                  </div>
                </div>

                {/* Finished Homework Section */}
                <div className="form-box">
                  <div className="question-group">
                    <div className="form-title">
                      <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
                      <p>Finished Homework</p>
                    </div>
                    <div className="radio-options">
                      <input
                        type="radio"
                        id="finished_homework-yes"
                        name="finished_homework"
                        value="yes"
                        checked={finished_homework === "yes"}
                        onChange={(e) => setFinishedHomework(e.target.value)}
                      />
                      <label htmlFor="finished_homework-yes">Yes</label>

                      <input
                        type="radio"
                        id="finished_homework-no"
                        name="finished_homework"
                        value="no"
                        checked={finished_homework === "no"}
                        onChange={(e) => setFinishedHomework(e.target.value)}
                      />
                      <label htmlFor="finished_homework-no">No</label>
                    </div>
                    {errors.finished_homework && <span className="error">{errors.finished_homework}</span>}
                  </div>
                </div>

                {/* Attitude Towards Learning Section */}
                <div className="form-box">
                  <div className="question-group">
                    <div className="form-title">
                      <MoodIcon className="form-title-icon" />
                      <p>Attitude Towards Learning</p>
                    </div>
                    <div className="radio-options">
                      <input
                        type="radio"
                        id="attitude_towards_learning-very_good"
                        name="attitude_towards_learning"
                        value="very_good"
                        checked={attitude_towards_learning === "very_good"}
                        onChange={(e) => setAttitudeTowardsLearning(e.target.value)}
                      />
                      <label htmlFor="attitude_towards_learning-very_good">Very Good</label>

                      <input
                        type="radio"
                        id="attitude_towards_learning-good"
                        name="attitude_towards_learning"
                        value="good"
                        checked={attitude_towards_learning === "good"}
                        onChange={(e) => setAttitudeTowardsLearning(e.target.value)}
                      />
                      <label htmlFor="attitude_towards_learning-good">Good</label>

                      <input
                        type="radio"
                        id="attitude_towards_learning-bad"
                        name="attitude_towards_learning"
                        value="bad"
                        checked={attitude_towards_learning === "bad"}
                        onChange={(e) => setAttitudeTowardsLearning(e.target.value)}
                      />
                      <label htmlFor="attitude_towards_learning-bad">Bad</label>
                    </div>
                    {errors.attitude_towards_learning && <span className="error">{errors.attitude_towards_learning}</span>}
                  </div>
                </div>

                {/* Comments Section */}
                <div className="comment-container">
                  <textarea
                    value={newReport}
                    onChange={(e) => setNewReport(e.target.value)}
                    placeholder="Extra comments here"
                  />
                  {errors.newReport && <span className="error">{errors.newReport}</span>}
                  <button className="submit-button" onClick={handleAddReport} disabled={!isFormValid}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="welcome-box-containerA">
        {/* Welcome Message Box */}
        <div className="welcome-boxA">
          <h2>Welcome, {mentorName}!</h2>
          <p>Today is {formatDateTime(currentDateTime)}</p>
        </div>

        {/* New Box under the Welcome Box */}
        <div className="new-boxA">
          <h2>Upcoming Meetings</h2>
          <AssignHWTable className="hw-table" />
        </div>
      </div>

    </div>
  );
}

export default WriteMenteeProgression;
