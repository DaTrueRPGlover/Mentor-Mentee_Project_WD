// src/components/HomeworkEach.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Linkify from 'react-linkify';
import './homeworkeach.css';
import { motion } from "framer-motion";
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
  const name = user?.name;
  const menteeName = name || "Mentee";

  const [currentDateTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.body.className = newTheme ? "dark-mode" : "";
    sessionStorage.setItem("isDarkMode", newTheme);
  };

  useEffect(() => {
    const savedTheme = sessionStorage.getItem("isDarkMode") === "true";
    setIsDarkMode(savedTheme);
    document.body.className = savedTheme ? "dark-mode" : "";
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  // ---- SAME SHARED INLINE MOCK DATA ----
  const MOCK_HOMEWORK = [
    {
      homework_id: 101,
      title: "Arrays & Big-O",
      description:
        "Solve 5 array problems and write a short note on time complexity. Helpful ref: https://bigocheatsheet.io/",
      assigned_date: "2025-08-05T10:00:00Z",
      due_date: "2025-08-12T23:59:59Z",
    },
    {
      homework_id: 102,
      title: "SQL Joins Practice",
      description:
        "Complete the worksheet on INNER/LEFT/RIGHT joins using sample data. Try this sandbox: https://www.db-fiddle.com/",
      assigned_date: "2025-08-07T12:00:00Z",
      due_date: "2025-08-14T23:59:59Z",
    },
    {
      homework_id: 103,
      title: "React State & Props",
      description:
        "Build a small component demonstrating lifting state up and prop drilling. See docs: https://react.dev/",
      assigned_date: "2025-08-09T09:30:00Z",
      due_date: "2025-08-16T23:59:59Z",
    },
  ];
  // --------------------------------------

  useEffect(() => {
    const loadMockEach = async () => {
      setLoading(true);
      try {
        // simulate latency
        await new Promise((r) => setTimeout(r, 400));
        const item = MOCK_HOMEWORK.find(h => h.homework_id === Number(homeworkId));
        if (!item) {
          setError('Homework not found (mock).');
        } else {
          setHomework(item);
          setError(null);
        }
      } catch (e) {
        setError('Failed to load homework details (mock). Please try again later.');
        console.error('Error loading mock homework details:', e);
      } finally {
        setLoading(false);
      }
    };

    loadMockEach();
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
        <div className="nav-buttons">
          <motion.button className="icon1" onClick={() => navigate("/interact-mentor")} whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button className="icon" onClick={() => navigate("/todo-progression")} whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
            <img src={write} alt="write" />
          </motion.button>
          <motion.button className="icon" onClick={() => navigate("/check-hw")} whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
            <img src={assign} alt="assign" />
          </motion.button>
          <motion.button className="icon" onClick={() => navigate("/mentee-meetings")} whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
            <img src={calendar} alt="calendar" />
          </motion.button>
        </div>

        <div className="slider-section">
          <span role="img" aria-label="Sun"></span>
          <label className="slider-container">
            <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
          <span role="img" aria-label="Moon"></span>
        </div>

        <motion.button className="logout-buttonV2" onClick={handleLogout} whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
          <img src={logout} alt="logout" />
        </motion.button>
      </div>

      <div className="white">
        <h1>{homework.title}</h1>
        {/* Auto-detect links */}
        <Linkify>
          <p className="homework-description">{homework.description}</p>
        </Linkify>
        <p className="homework-date">Assigned: {format(new Date(homework.assigned_date), 'MMMM dd, yyyy')}</p>
        <p className="homework-date">Due: {format(new Date(homework.due_date), 'MMMM dd, yyyy')}</p>
      </div>
    </div>
  );
};

export default HomeworkEach;
