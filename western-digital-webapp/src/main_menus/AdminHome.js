import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./AdminHome.css";
import logo from "../assets/WDC.png";
import talk from "../assets/talk.png";
import twopeople from "../assets/twopeople.png";
import one from "../assets/one.png";
import notes from "../assets/notes2.0.png";

function AdminHome() {
  const navigate = useNavigate();

  const adminName = sessionStorage.getItem("adminName") || "Admin";

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.className = isDarkMode ? "" : "dark-mode";
  };

  return (
    <motion.div
      className="admin-home"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <header className="header-container">
        <div className="top-header">
          <img src={logo} alt="Logo" className="logo" />
          <motion.button
            className="logout-button"
            onClick={handleLogout}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            Logout
          </motion.button>
          <div className="slider-section">
            <span role="img" aria-label="Sun">

            </span>
            <label className="slider-container">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleTheme}
              />
              <span className="slider"></span>
            </label>
            <span role="img" aria-label="Moon">

            </span>
          </div>
        </div>

        <h1 className="welcome-message">Welcome Admin {adminName}</h1>
      </header>

      <main className="main-content">
        <div className="button-container">
          <motion.button
            className="circle"
            onClick={() => navigate("/see-interactions")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={talk} alt="Talk" className="circle-image" />
            <h3 className="title">See Interactions</h3>
          </motion.button>

          <motion.button
            className="circle"
            onClick={() => navigate("/assign-mentor")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={twopeople} alt="Twopeople" className="circle-image" />
            <h3 className="title">Assign Mentor to Mentee</h3>
          </motion.button>

          <motion.button
            className="circle"
            onClick={() => navigate("/view-progressions")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={notes} alt="Notes" className="circle-image" />
            <h3 className="title">View Progressions</h3>
          </motion.button>

          <motion.button
            className="circle"
            onClick={() => navigate("/create-account")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={one} alt="One" className="circle-image" />
            <h3 className="title">Create Account</h3>
          </motion.button>
        </div>
        <div className="footer">
          © 2024 Western Digital Corporation or its affiliates. All rights reserved.
        </div>
      </main>
    </motion.div>
  );
}

export default AdminHome;
