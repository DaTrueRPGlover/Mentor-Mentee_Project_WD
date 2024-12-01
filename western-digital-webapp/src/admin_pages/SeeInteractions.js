import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import "./SeeInteractions.css";
import logo from "../assets/WDC.png";

function SeeInteractions() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedMentee, setSelectedMentee] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/mentors")
      .then((response) => response.json())
      .then((data) => setMentors(data))
      .catch((error) => console.error("Error fetching mentors:", error));

    fetch("http://localhost:3001/api/mentees")
      .then((response) => response.json())
      .then((data) => setMentees(data))
      .catch((error) => console.error("Error fetching mentees:", error));
  }, []);

  useEffect(() => {
    if (!selectedMentor || !selectedMentee) return;

    fetch(
      `http://localhost:3001/api/messages?mentorkey=${selectedMentor}&menteekey=${selectedMentee}`
    )
      .then((response) => response.json())
      .then((data) => {
        const formattedMessages = data.map((msg) => ({
          sender: msg.sender_role === "mentee" ? "Mentee" : "Mentor",
          content: msg.message_text,
          timestamp: new Date(msg.message_time).toLocaleString(),
        }));
        setMessages(formattedMessages);
      })
      .catch((error) => console.error("Error fetching messages:", error));
  }, [selectedMentor, selectedMentee]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="see-interactions">
      <header className="header-container">
        <div className="top-header">
          <button
            className="logo-button"
            onClick={() => navigate("/admin-home")}
          >
            <img src={logo} alt="Logo" className="logo" />
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="purp">
          <h1 className="welcome-message">View Interactions</h1>
        </div>
        
      </header>

      <div className="search">
        <div className="filter-section">
          <h2>Search</h2>
          <label>Select a Mentor:</label>
          <select
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
          >
            <option value="" disabled>
              Select a mentor
            </option>
            {mentors.map((mentor) => (
              <option key={mentor.userid} value={mentor.userid}>
                {mentor.name}
              </option>
            ))}
          </select>

          <label>Select a Mentee:</label>
          <select
            value={selectedMentee}
            onChange={(e) => setSelectedMentee(e.target.value)}
          >
            <option value="" disabled>
              Select a mentee
            </option>
            {mentees.map((mentee) => (
              <option key={mentee.userid} value={mentee.userid}>
                {mentee.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedMentor && selectedMentee && (
        <MainContainer className="chat-container">
          <ChatContainer>
            <ConversationHeader>
              <Avatar src="https://via.placeholder.com/40" name="Chat" />
              <ConversationHeader.Content
                userName="Mentor - Mentee Interactions"
                info={`Mentor ID: ${selectedMentor}, Mentee ID: ${selectedMentee}`}
              />
            </ConversationHeader>
            <MessageList>
              {messages.map((message, index) => (
                <Message
                  key={index}
                  model={{
                    message: message.content,
                    sentTime: message.timestamp,
                    sender: message.sender,
                    direction:
                      message.sender === "Mentor" ? "outgoing" : "incoming",
                    position: "normal",
                  }}
                />
              ))}
            </MessageList>
          </ChatContainer>
        </MainContainer>
      )}
    </div>
  );
}

export default SeeInteractions;
