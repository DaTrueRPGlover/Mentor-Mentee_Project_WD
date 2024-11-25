import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import "./AdminHome.css"; // Import the CSS file

import logo from "../assets/WDC.png"; // Adjust the path as needed
import talk from "../assets/talk.png"; // Adjust the path as needed
import twopeople from "../assets/twopeople.png"; // Adjust the path as needed
import one from "../assets/one.png"; // Adjust the path as needed
import notes from "../assets/notes.png"; // Adjust the path as needed

function AdminHome() {
  const navigate = useNavigate();

  // Retrieve admin's name from local storage or context
  const adminName = localStorage.getItem("adminName") || "Admin";

  const handleLogout = () => {
    // Clear user data
    localStorage.clear();
    navigate("/");
  };

  return (
    <motion.div
      className="admin-home"
      initial={{ y: "100%" }} // Start from the left
      animate={{ y: 0 }} // Move to the right (default position)
      exit={{ y: "100%" }} // Slide out to the right when leaving
      transition={{ type: "spring", stiffness: 300, damping: 30 }} // Smooth animation
    >
      <header className="header-container">
        <div className="top-header">
          <img src={logo} alt="Logo" className="logo" />
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <h1 className="welcome-message">Welcome Admin {adminName}</h1>
      </header>

      <main className="main-content">
        <div className="button-container">
          <button
            className="circle"
            onClick={() => navigate("/see-interactions")}
          >
            <img src={talk} alt="Talk" className="circle-image" />
            <h3 className="title">See Interactions</h3>
          </button>

          <button
            className="circle"
            onClick={() => navigate("/assign-mentor")}
          >
            <img src={twopeople} alt="Twopeople" className="circle-image" />
            <h3 className="title">Assign Mentor to Mentee</h3>
          </button>

          <button
            className="circle"
            onClick={() => navigate("/view-progressions")}
          >
            <img src={notes} alt="Notes" className="circle-image" />
            <h3 className="title">View Progressions</h3>
          </button>

          <button
            className="circle"
            onClick={() => navigate("/create-account")}
          >
            <img src={one} alt="One" className="circle-image" />
            <h3 className="title">Create Account</h3>
          </button>
        </div>
      </main>
    </motion.div>
  );
}

export default AdminHome;
