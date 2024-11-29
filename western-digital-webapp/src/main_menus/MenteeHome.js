import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import "./MenteeHome.css";

import logo from "../assets/WDC.png";
import talk from "../assets/talk.png";
import notes from "../assets/notes.png";
import calendar from "../assets/schedule.png";
import hw from '../assets/hw.png';

function MenteeHome() {
  const navigate = useNavigate();
  const menteeName = localStorage.getItem("menteeName") || "Mentee";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <motion.div
      className="mentee-home"
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
        </div>
        <h1 className="welcome-message">Welcome Mentee {menteeName}</h1>
      </header>

      <main className="main-content">
        <div className="button-container">
          <motion.button
            className="circle"
            onClick={() => navigate("/interact-mentor")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={talk} alt="Talk" className="circle-image" />
            <h3 className="title">Interact with Mentor</h3>
          </motion.button>

          <motion.button
            className="circle"
            onClick={() => navigate("/todo-progression")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={notes} alt="Notes" className="circle-image" />
            <h3 className="title">TO-DO/Progressions</h3>
          </motion.button>

          <motion.button
            className="circle"
            onClick={() => navigate("/check-hw")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={hw} alt="HW" className="circle-image" />
            <h3 className="title">Assignments</h3>
          </motion.button>

          <motion.button
            className="circle"
            onClick={() => navigate("/mentee-meetings")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={calendar} alt="Calendar" className="circle-image" />
            <h3 className="title">Mentor Meetings</h3>
          </motion.button>
        </div>
        <div className="footer">
          © 2024 Western Digital Corporation or its affiliates. All rights reserved.
        </div>
      </main>
    </motion.div>
  );
}

export default MenteeHome;
