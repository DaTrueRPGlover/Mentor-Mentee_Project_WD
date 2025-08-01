// src/components/CheckHW.js
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import './checkHW.css';
import { motion } from "framer-motion"; // Importing motion
import logo from "../assets/WDC2.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import assign from "../assets/assign.png";
import calendar from "../assets/calendar.png";
import logout from "../assets/logout.png";
import CheckHWTable from "./CheckHWTable.js"; // Import the ChatBox component

const CheckHW = () => {
  const navigate = useNavigate();
  const [homeworkData, setHomeworkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = JSON.parse(sessionStorage.getItem('user'));
  const menteeKey = userInfo?.menteekey;
  const user = JSON.parse(sessionStorage.getItem("user"));
  const name = user['name']
  console.log(user);
  console.log(name)
  const menteeName = name|| "Mentee";
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
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
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
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
    const fetchHomework = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/api/homework/mentee/${menteeKey}`);
        const data = await response.json();
        setHomeworkData(data || []);
      } catch (error) {
        setError('Failed to fetch homework. Please try again later.');
        console.error('Error fetching homework:', error);
      } finally {
        setLoading(false);
      }
    };

    if (menteeKey) {
      fetchHomework();
    } else {
      setError('Mentee key not found.');
      setLoading(false);
    }
  }, [menteeKey]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="check-hw">

      <div className="logo-title-container">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="title-header">Assigned Homework</h1>
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
            className="icon"
            onClick={() => navigate("/todo-progression")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={write} alt="write" />
          </motion.button>
          <motion.button
            className="icon1"
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
          <div className="box1">
            <div className="box">
              <div className="main-content">
                {/* Homework List */}
                <div className="whiteR">
                  {homeworkData.length === 0 ? (
                    <p className="no-homework">No homework assignments found.</p>
                  ) : (
                    <div className="homework-list">
                      {homeworkData.map((hw) => (
                        <Link to={`/homework/${hw.homework_id}`} key={hw.homework_id} className="homework-card">
                          <h2 className="homework-title">{hw.title}</h2>
                          <p className="homework-description">{hw.description}</p>
                          <p className="homework-date">
                            Assigned: {format(new Date(hw.assigned_date), 'MMMM dd, yyyy')}
                          </p>
                          <p className="homework-date">
                            Due: {format(new Date(hw.due_date), 'MMMM dd, yyyy')}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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
<div className="new-boxA">
  <h2>Upcoming Meetings and Homework</h2>
  <div className="chat-box-container">
    <CheckHWTable />
  </div>
</div>
      </div>
    </div>
  );
};

export default CheckHW;
