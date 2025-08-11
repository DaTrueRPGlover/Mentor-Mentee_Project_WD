// src/components/CheckHW.js
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import './checkHW.css';
import { motion } from "framer-motion";
import logo from "../assets/WDC2.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import assign from "../assets/assign.png";
import calendar from "../assets/calendar.png";
import logout from "../assets/logout.png";
import CheckHWTable from "./CheckHWTable.js";

const CheckHW = () => {
  const navigate = useNavigate();
  const [homeworkData, setHomeworkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = JSON.parse(sessionStorage.getItem('user'));
  const menteeKey = userInfo?.menteekey;
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

  // ---- SHARED INLINE MOCK DATA ----
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
  // ----------------------------------

  useEffect(() => {
    const loadMock = async () => {
      setLoading(true);
      try {
        // simulate latency
        await new Promise((r) => setTimeout(r, 400));
        setHomeworkData(MOCK_HOMEWORK);
        setError(null);
      } catch (e) {
        setError('Failed to load homework (mock). Please try again later.');
        console.error('Error loading mock homework:', e);
      } finally {
        setLoading(false);
      }
    };

    // Keep same flow; just use mock
    if (typeof menteeKey !== "undefined") {
      loadMock();
    } else {
      loadMock();
    }
  }, [menteeKey]); // menteeKey kept to preserve original behavior

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="check-hw">
      <div className="logo-title-container">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="title-header">Assigned Homework</h1>
      </div>

      <div className="sidebarA">
        <div className="nav-buttonsA">
          <motion.button className="icon" onClick={() => navigate("/interact-mentor")} whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button className="icon" onClick={() => navigate("/todo-progression")} whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
            <img src={write} alt="write" />
          </motion.button>
          <motion.button className="icon1" onClick={() => navigate("/check-hw")} whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
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

      <div className="content-wrapperVA">
        <div className="chat-boxA">
          <div className="box1">
            <div className="box">
              <div className="main-content">
                <div className="whiteR">
                  {homeworkData.length === 0 ? (
                    <p className="no-homework">No homework assignments found.</p>
                  ) : (
                    <div className="homework-list">
                      {homeworkData.map((hw) => (
                        <Link to={`/homework/${hw.homework_id}`} key={hw.homework_id} className="homework-card">
                          <h2 className="homework-title">{hw.title}</h2>
                          <p className="homework-description">{hw.description}</p>
                          <p className="homework-date">Assigned: {format(new Date(hw.assigned_date), 'MMMM dd, yyyy')}</p>
                          <p className="homework-date">Due: {format(new Date(hw.due_date), 'MMMM dd, yyyy')}</p>
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

      <div className="welcome-box-containerA">
        <div className="welcome-boxA">
          <h2>Welcome, {menteeName}!</h2>
          <p>Today is {formatDateTime(currentDateTime)}</p>
        </div>

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
