// src/components/interactwithmentor.js
import React, { useState, useEffect, useRef } from "react";
import "./InteractWithMentor.css";
import logo from "../assets/WDC2.png";
import chatIcon from "../assets/chat.png";
import writeIcon from "../assets/write.png";
import assignIcon from "../assets/assign.png";
import calendarIcon from "../assets/calendar.png";
import logoutIcon from "../assets/logout.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CheckHWTable from "./CheckHWTable";

// initial mock chat
const initialChat = [
  { id: 1, sender: "Mentor", text: "Hey! How's the project?", time: new Date() },
  { id: 2, sender: "You",    text: "Good, just testing this chat UI.", time: new Date() },
  { id: 3, sender: "Mentor", text: "Nice progress so far!", time: new Date() },
  { id: 4, sender: "You",    text: "Thanks!", time: new Date() },
];

export default function InteractWithMentor() {
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [chatMessages, setChatMessages] = useState(initialChat);
  const [messageInput, setMessageInput] = useState("");
  const [currentDateTime] = useState(new Date());
  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  const menteeName = user.name || "Mentee";

  // Meeting modal state (fed by CheckHWTable)
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatMessages]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleSend = () => {
    if (!messageInput.trim()) return;
    setChatMessages((msgs) => [
      ...msgs,
      { id: msgs.length + 1, sender: "You", text: messageInput.trim(), time: new Date() }
    ]);
    setMessageInput("");
  };

  const formatTime = (d) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="interact-with-mentor">
      {/* Topbar (no logout here) */}
      <div className="logo-title-container">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="title-header">Chat With Mentor</h1>
      </div>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-main">
          <motion.button
            className="icon active"
            onClick={() => navigate("/interact-mentor")}
            whileHover={{ scale: 1.08 }}
          >
            <img src={chatIcon} alt="Chat" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/todo-progression")}
            whileHover={{ scale: 1.08 }}
          >
            <img src={writeIcon} alt="Write" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/check-hw")}
            whileHover={{ scale: 1.08 }}
          >
            <img src={assignIcon} alt="Assign" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/mentee-meetings")}
            whileHover={{ scale: 1.08 }}
          >
            <img src={calendarIcon} alt="Calendar" />
          </motion.button>
        </div>

        {/* Logout pinned at bottom */}
        <div className="logout-container">
          <motion.button
            className="icon logout-btn"
            onClick={handleLogout}
            whileHover={{ scale: 1.08 }}
          >
            <img src={logoutIcon} alt="logout" />
          </motion.button>
        </div>
      </aside>

      {/* Chat */}
      <div className="content-wrapperV2">
        <div className="chat-box">
          <div className="chat-content" ref={contentRef}>
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${msg.sender === "You" ? "outgoing" : "incoming"}`}
              >
                <div className="bubble">
                  <p>{msg.text}</p>
                  <span className="timestamp">{formatTime(msg.time)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-options">
            <input
              type="text"
              placeholder="Type a message…"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>

      {/* Right-side: Upcoming + Homework (from shared table) */}
      <div className="welcome-box-container">
        <div className="welcome-box">
          <h2>Welcome, {menteeName}!</h2>
          <p>{currentDateTime.toLocaleString()}</p>
        </div>
        <div className="new-box">
          <h2>Upcoming Meetings & Homework</h2>
          <div className="check-hw-table-container">
            {/* When a Meeting card is clicked in this table, open the modal */}
            <CheckHWTable
              onMeetingClick={(item) =>
                setSelectedMeeting({
                  title: item.title,
                  description: item.description,
                  date: item.date,
                  joinUrl: item.joinUrl, // may be undefined; we handle that below
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Meeting Modal triggered by CheckHWTable click */}
      {selectedMeeting && (
        <div className="modal-overlay" onClick={() => setSelectedMeeting(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedMeeting(null)}
              aria-label="Close"
            >
              ✖
            </button>
            <h3>{selectedMeeting.title}</h3>
            {selectedMeeting.description && <p>{selectedMeeting.description}</p>}
            {selectedMeeting.date && (
              <p>
                <strong>When:</strong>{" "}
                {selectedMeeting.date.toLocaleString()}
              </p>
            )}
            <a
              className={`join-link ${!selectedMeeting.joinUrl ? 'disabled' : ''}`}
              href={selectedMeeting.joinUrl || '#'}
              target={selectedMeeting.joinUrl ? "_blank" : "_self"}
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!selectedMeeting.joinUrl) e.preventDefault();
              }}
            >
              {selectedMeeting.joinUrl ? 'Join Meeting' : 'Join link unavailable'}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
