import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Linkify from 'react-linkify';
import './homeworkeach.css';
import { motion } from "framer-motion"; // Importing motion
import logo from "../assets/WDC2.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import assign from "../assets/assign.png";
import calendar from "../assets/calendar.png";
import logout from "../assets/logout.png";
import { useNavigate } from "react-router-dom";
const HomeworkEach = () => {
  const { homeworkId } = useParams();
  const [homework, setHomework] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const name = user['name']
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
  useEffect(() => {
    const fetchHomeworkEach = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/homework/${homeworkId}`);
        const data = await response.json();
        setHomework(data);
      } catch (error) {
        setError('Failed to fetch homework details. Please try again later.');
        console.error('Error fetching homework details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworkEach();
  }, [homeworkId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="homework-detail">
            <div className="logo-title-container">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="title-header">View Homework</h1>
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
      <div className="white">
        <h1>{homework.title}</h1>
        {/* Wrap description in Linkify to auto-detect links */}
        <Linkify>
          <p className="homework-description">{homework.description}</p>
        </Linkify>
        <p className="homework-date">
          Assigned: {format(new Date(homework.assigned_date), 'MMMM dd, yyyy')}
        </p>
        <p className="homework-date">
          Due: {format(new Date(homework.due_date), 'MMMM dd, yyyy')}
        </p>
      </div>

    </div>
  );
};

export default HomeworkEach;
