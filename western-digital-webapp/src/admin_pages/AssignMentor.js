import React, { useState, useEffect } from "react";
import "./AssignMentor.css";
import logout from "../assets/logout.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import one from "../assets/one.png";
import twopeople from "../assets/twopeople.png";
import { useNavigate } from "react-router-dom";
import logo from "../assets/WDC2.png";
import { motion } from "framer-motion";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import CreateAccountForm from "./CreateAccountForm.js";

function AssignMentor() {
  const navigate = useNavigate();

  // States for tracking data
  const [newMentee, setNewMentee] = useState(null);
  const [newMentor, setNewMentor] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [menteesList, setMenteesList] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // User data and theme
  const user = JSON.parse(sessionStorage.getItem("user"));
  const name = user?.name;
  const adminName = name || "Admin";
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.body.className = newTheme ? "dark-mode" : "";
    sessionStorage.setItem("isDarkMode", newTheme);
  };

  // Load saved dark mode
  useEffect(() => {
    const savedTheme = sessionStorage.getItem("isDarkMode") === "true";
    setIsDarkMode(savedTheme);
    document.body.className = savedTheme ? "dark-mode" : "";
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMentorNames(),
          fetchMenteeNames(),
          fetchRelationships(),
        ]);
      } catch {
        setErrorMessage("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // API calls
  const fetchMentorNames = async () => {
    const response = await fetch("http://localhost:3001/api/mentors");
    if (response.ok) setMentors(await response.json());
  };

  const fetchMenteeNames = async () => {
    const response = await fetch("http://localhost:3001/api/mentees");
    if (response.ok) setMenteesList(await response.json());
  };

  const fetchRelationships = async () => {
    const response = await fetch("http://localhost:3001/api/relationships");
    if (response.ok) setRelationships(await response.json());
  };

  // Format date
  const formatDateTime = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Assign mentor
  const handleAssignMentor = async () => {
    if (!newMentee || !newMentor) {
      setErrorMessage("Please select both a mentor and a mentee.");
      return;
    }

    const newAssignment = {
      menteekey: newMentee.userid,
      mentorkey: newMentor.userid,
    };

    try {
      const response = await fetch(
        "http://localhost:3001/api/relationships/assign",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAssignment),
        }
      );

      if (response.ok) {
        await fetchRelationships();
        setNewMentee(null);
        setNewMentor(null);
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to assign mentor");
      }
    } catch {
      setErrorMessage("An unexpected error occurred");
    }
  };

  // Update mentor
  const handleUpdateMentor = async (menteekey, newMentorkey) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/relationships/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ menteekey, mentorkey: newMentorkey }),
        }
      );

      if (response.ok) await fetchRelationships();
      else setErrorMessage("Failed to update mentor");
    } catch {
      setErrorMessage("An unexpected error occurred");
    }
  };

  // Delete assignment
  const handleDeleteAssignment = async (relationship_id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/relationships/${relationship_id}`,
        { method: "DELETE" }
      );

      if (response.ok) await fetchRelationships();
      else setErrorMessage("Failed to delete assignment");
    } catch {
      setErrorMessage("An unexpected error occurred");
    }
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="assign-mentor">
      {/* Header */}
      <div className="logo-title-container">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="title-header">Assign Mentor to Mentee</h1>
      </div>

      {/* Sidebar */}
      <div className="sidebarA">
        <div className="nav-buttonsA">
          <motion.button
            className="icon"
            onClick={() => navigate("/see-interactions")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/view-progressions")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={write} alt="write" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/create-account")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={one} alt="create" />
          </motion.button>
          <motion.button
            className="icon1"
            onClick={() => navigate("/assign-mentor")}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
          >
            <img src={twopeople} alt="twopeople" />
          </motion.button>
        </div>

        {/* Dark mode toggle */}
        <div className="slider-section">
          <label className="slider-container">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Logout */}
        <motion.button
          className="logout-buttonV2"
          onClick={handleLogout}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <img src={logout} alt="logout" />
        </motion.button>
      </div>

      {/* Main content */}
      <div className="content-wrapperVA">
        <div className="chat-boxA">
          <div className="box1">
            <div className="chat-containerA">
              <div className="content-container">
                <div className="add-assignment">
                  {/* Dropdowns */}
                  <select
                    className="option"
                    value={newMentee?.userid || ""}
                    onChange={(e) => {
                      const mentee = menteesList.find(
                        (m) => m.userid === e.target.value
                      );
                      setNewMentee(mentee);
                    }}
                  >
                    <option value="">-- Select Mentee --</option>
                    {menteesList.map((mentee) => (
                      <option key={mentee.userid} value={mentee.userid}>
                        {mentee.name} {mentee.lastname}
                      </option>
                    ))}
                  </select>

                  <select
                    className="option"
                    value={newMentor?.userid || ""}
                    onChange={(e) => {
                      const mentor = mentors.find(
                        (m) => m.userid === e.target.value
                      );
                      setNewMentor(mentor);
                    }}
                  >
                    <option value="">-- Select Mentor --</option>
                    {mentors.map((mentor) => (
                      <option key={mentor.userid} value={mentor.userid}>
                        {mentor.name} {mentor.lastname}
                      </option>
                    ))}
                  </select>

                  <button className="Assign" onClick={handleAssignMentor}>
                    Assign Mentor
                  </button>

                  <h3 className="Existing">Existing Assignments:</h3>
                </div>

                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}

                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <table className="assignments-table">
                    <thead>
                      <tr>
                        <th>Mentor</th>
                        <th>Mentee</th>
                        <th>Change Mentor</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relationships.map((rel) => (
                        <tr key={rel.relationship_id}>
                          <td>
                            {rel.mentor_name} {rel.mentor_lastname}
                          </td>
                          <td>
                            {rel.mentee_name} {rel.mentee_lastname}
                          </td>
                          <td>
                            <select
                              onChange={(e) => {
                                const newMentorkey = e.target.value;
                                if (newMentorkey)
                                  handleUpdateMentor(
                                    rel.menteekey,
                                    newMentorkey
                                  );
                              }}
                            >
                              <option value="">Select Mentor</option>
                              {mentors.map((mentor) => (
                                <option
                                  key={mentor.userid}
                                  value={mentor.userid}
                                >
                                  {mentor.name} {mentor.lastname}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                handleDeleteAssignment(rel.relationship_id)
                              }
                              className="delete-button"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="welcome-box-containerA">
        <div className="welcome-boxA">
          <h2>Welcome, {adminName}!</h2>
          <p>Today is {formatDateTime(currentDateTime)}</p>
        </div>
        <div className="new-boxA">
          <h2>Create Account</h2>
          <CreateAccountForm />
        </div>
      </div>
    </div>
  );
}

export default AssignMentor;

