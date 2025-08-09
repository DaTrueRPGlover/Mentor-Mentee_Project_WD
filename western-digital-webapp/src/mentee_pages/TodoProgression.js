// src/components/todoprogression.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  EventBusyOutlined,
  AssignmentTurnedInOutlined,
  Mood,
} from "@mui/icons-material";
import { format } from "date-fns";
import "./TodoProgression.css";

import logo from "../assets/WDC2.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import assign from "../assets/assign.png";
import calendar from "../assets/calendar.png";
import logout from "../assets/logout.png";

// Mock meetings data
const mockMeetings = [
  { key: "mt1", datetime: new Date(2025, 7, 5, 10, 0) },
  { key: "mt2", datetime: new Date(2025, 7, 12, 14, 30) },
  { key: "mt3", datetime: new Date(2025, 7, 20, 9, 15) },
];

export default function TodoProgression() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState("");
  const [ratings, setRatings] = useState({
    communication: "",
    influence: "",
    managingProjects: "",
    innovation: "",
    emotionalIntelligence: "",
    decisionMaking: "",
  });
  const [comments, setComments] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMeetings(mockMeetings);
    document.body.classList.remove("dark-mode");
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const ratingToScore = (r) =>
    r === "Very Helpful" ? 3 : r === "Somewhat Helpful" ? 2 : 1;

  const validate = () => {
    const errs = {};
    if (!selectedMeeting) errs.selectedMeeting = "Choose a meeting";
    Object.entries(ratings).forEach(([k, v]) => {
      if (!v) errs[k] = "Required";
    });
    if (!comments.trim()) errs.comments = "Add comments";
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log({
      meeting: selectedMeeting,
      ratings: Object.fromEntries(
        Object.entries(ratings).map(([k, v]) => [k, ratingToScore(v)])
      ),
      comments,
    });
    alert("Report submitted (mock)");

    setSelectedMeeting("");
    setRatings({
      communication: "",
      influence: "",
      managingProjects: "",
      innovation: "",
      emotionalIntelligence: "",
      decisionMaking: "",
    });
    setComments("");
    setErrors({});
  };

  const ratingFields = [
    { key: "communication", icon: <EventBusyOutlined />, label: "Communication" },
    { key: "influence", icon: <AssignmentTurnedInOutlined />, label: "Influence" },
    { key: "managingProjects", icon: <Mood />, label: "Managing Projects" },
    { key: "innovation", icon: <AssignmentTurnedInOutlined />, label: "Innovation" },
    { key: "emotionalIntelligence", icon: <AssignmentTurnedInOutlined />, label: "Emotional Intelligence" },
    { key: "decisionMaking", icon: <AssignmentTurnedInOutlined />, label: "Decision Making" },
  ];

  return (
    <div className="todo-progression">
      {/* Topbar */}
      <header className="header">
        <div className="logo-title">
          <img src={logo} alt="logo" className="logo" />
          <h1 className="title">Write Progression</h1>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-main">
          <motion.button className="icon" onClick={() => navigate("/interact-mentor")} whileHover={{ scale: 1.08 }}>
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button className="icon active" onClick={() => navigate("/todo-progression")} whileHover={{ scale: 1.08 }}>
            <img src={write} alt="write" />
          </motion.button>
          <motion.button className="icon" onClick={() => navigate("/check-hw")} whileHover={{ scale: 1.08 }}>
            <img src={assign} alt="assign" />
          </motion.button>
          <motion.button className="icon" onClick={() => navigate("/mentee-meetings")} whileHover={{ scale: 1.08 }}>
            <img src={calendar} alt="calendar" />
          </motion.button>
        </div>

        <div className="logout-container">
          <motion.button className="icon logout-btn" onClick={handleLogout} whileHover={{ scale: 1.08 }}>
            <img src={logout} alt="logout" />
          </motion.button>
        </div>
      </aside>

      {/* Form */}
      <main className="main-content">
        <form className="form-area" onSubmit={handleSubmit}>
          <div className="dropdown-container">
            <label htmlFor="mt">Meeting</label>
            <select
              id="mt"
              value={selectedMeeting}
              onChange={(e) => setSelectedMeeting(e.target.value)}
            >
              <option value="">-- choose --</option>
              {meetings.map((m) => (
                <option key={m.key} value={m.key}>
                  {format(m.datetime, "MMM dd, yyyy p")}
                </option>
              ))}
            </select>
            {errors.selectedMeeting && <div className="error-msg">{errors.selectedMeeting}</div>}
          </div>

          {ratingFields.map(({ key, icon, label }) => (
            <div className="form-box" key={key}>
              <div className="form-title">
                {icon}
                <p>{label}</p>
              </div>
              <div className="radio-options">
                {["Very Helpful", "Somewhat Helpful", "Not Helpful"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name={key}
                      value={opt}
                      checked={ratings[key] === opt}
                      onChange={() =>
                        setRatings((r) => ({ ...r, [key]: opt }))
                      }
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {errors[key] && <div className="error-msg">{errors[key]}</div>}
            </div>
          ))}

          <div className="comment-container">
            <textarea
              placeholder="Extra comments..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            {errors.comments && <div className="error-msg">{errors.comments}</div>}
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}
