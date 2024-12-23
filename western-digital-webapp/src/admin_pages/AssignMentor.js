import React, { useState, useEffect } from "react";
import "./AssignMentor.css";
import logout from "../assets/logout.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import one from "../assets/one.png";
import twopeople from "../assets/twopeople.png";
import { useNavigate } from "react-router-dom";
import logo from "../assets/WDC2.png";
import { motion } from "framer-motion"; // Importing motion
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import CreateAccountForm from "./CreateAccountForm.js";
function AssignMentor() {
  const navigate = useNavigate();
  // States for tracking data related to mentees, mentors, assignments, and UI state
  const [newMentee, setNewMentee] = useState(null);
  const [newMentor, setNewMentor] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [menteesList, setMenteesList] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  // User data and theme state
  const user = JSON.parse(sessionStorage.getItem("user"));
  const name = user['name']
  const adminName = name || "Admin";
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Function to toggle dark mode theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.body.className = newTheme ? "dark-mode" : "";
    sessionStorage.setItem("isDarkMode", newTheme); // Save state
  };
  // Effect to load saved dark mode theme on initial load
  useEffect(() => {
    const savedTheme = sessionStorage.getItem("isDarkMode") === "true"; // Retrieve state
    setIsDarkMode(savedTheme);
    document.body.className = savedTheme ? "dark-mode" : "";
  }, []);
  // Effect to update current date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);
  // Function to fetch all names and relationships via Functions written here
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMentorNames(),
          fetchMenteeNames(),
          fetchRelationships(),
        ]);
      } catch (error) {
        setErrorMessage("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to fetch all names and relationships via API and database
  const fetchMentorNames = async () => {
    const response = await fetch("http://localhost:3001/api/mentors");
    if (response.ok) {
      const data = await response.json();
      setMentors(data);
    }
  };
  // Fetch all mentee names from the API
  const fetchMenteeNames = async () => {
    const response = await fetch("http://localhost:3001/api/mentees");
    if (response.ok) {
      const data = await response.json();
      setMenteesList(data);
    }
  };
  // Fetch all relationship data from the API
  const fetchRelationships = async () => {
    const response = await fetch("http://localhost:3001/api/relationships");
    if (response.ok) {
      const data = await response.json();
      setRelationships(data);
    }
  };
  // Format date and time for display
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
  // Assign mentor to mentee
  const handleAssignMentor = async () => {
    if (newMentee && newMentor) {
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
      } catch (error) {
        setErrorMessage("An unexpected error occurred");
      }
    } else {
      setErrorMessage("Please select both a mentor and a mentee.");
    }
  };
  // changes relationships for mentor to mentee
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
      if (response.ok) {
        await fetchRelationships();
      } else {
        setErrorMessage("Failed to update mentor");
      }
    } catch {
      setErrorMessage("An unexpected error occurred");
    }
  };
  // deletes mentor to mentee
  const handleDeleteAssignment = async (relationship_id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/relationships/${relationship_id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        await fetchRelationships();
      } else {
        setErrorMessage("Failed to delete assignment");
      }
    } catch {
      setErrorMessage("An unexpected error occurred");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="assign-mentor">
      <div className="logo-title-container">
          <img src={logo} alt="logo" className="logo" />
          <h1 className="title-header">Assign Mentor to Mentee</h1>
      </div>
      <div className="sidebarB">
        {/* Navigation Buttons */}
        <div className="nav-buttonsB">
          <motion.button
            className="icon"
            onClick={() => navigate("/see-interactions")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/view-progressions")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={write} alt="write" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/create-account")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={one} alt="create" />
          </motion.button>
          <motion.button
            className="icon1"
            onClick={() => navigate("/assign-mentor")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={twopeople} alt="twopeople" />
          </motion.button>
        </div>

        {/* Logout Button */}
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
          <div className="chat-containerA">
          <div className="content-container">
        <div className="add-assignment">
       {/* Drop down menu for both mentee and mentor */}
          <select className="option"
            value={newMentee ? newMentee.userid : ""}
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
          <select className="option"
            value={newMentor ? newMentor.userid : ""}
            onChange={(e) => {
              const mentor = mentors.find((m) => m.userid === e.target.value);
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
          <button  className="Assign" onClick={handleAssignMentor}>Assign Mentor</button>
          <h3 className="Existing" >Existing Assignments:</h3>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        
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
            {/* Displays and assigns the relationship */}
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
                          handleUpdateMentor(rel.menteekey, newMentorkey);
                      }}
                    >
                      <option value="">Select Mentor</option>
                      {mentors.map((mentor) => (
                        <option key={mentor.userid} value={mentor.userid}>
                          {mentor.name} {mentor.lastname}
                        </option>
                      ))}
                    </select>
                  </td>
                  {/* deletes connection between mentor and mentee*/}
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
      <div className="welcome-box-containerA">
      {/* Welcome Message Box */}
      <div className="welcome-boxA">
        <h2>Welcome, {adminName}!</h2>
        <p>Today is {formatDateTime(currentDateTime)}</p>
      </div>

      {/* New Box under the Welcome Box */}
      <div className="new-boxA">
        <h2>Create Account</h2>
        <CreateAccountForm/>
      </div>
    </div>
    </div>
  );
}

export default AssignMentor;
