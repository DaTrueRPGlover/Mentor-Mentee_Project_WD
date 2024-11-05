import React, { useState } from 'react';
import './InteractWithMentor.css';
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import logo from '../assets/WDC.png';

function InteractWithMentor() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const user = JSON.parse(localStorage.getItem('user'));
  
      if (!user) {
        console.error('User not logged in');
        return;
      }
  
      const menteekey = user.menteekey;
      const mentorkey = user.mentorkey;
  
      if (!menteekey || !mentorkey) {
        console.error('Keys not found');
        return;
      }
  
      // Prepare message data
      let messageData = {
        isMentee: user.role.toLowerCase() === 'mentee',
        isMentor: user.role.toLowerCase() === 'mentor',
        menteekey: menteekey,
        mentorkey: mentorkey,
        menteetext: null,
        mentortext: null,
      };
  
      // Set the appropriate text field
      if (user.role.toLowerCase() === 'mentee') {
        messageData.menteetext = newMessage;
      } else if (user.role.toLowerCase() === 'mentor') {
        messageData.mentortext = newMessage;
      }
  
      fetch('http://localhost:3001/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Update messages state
          setMessages([
            ...messages,
            {
              sender: user.role.toLowerCase() === 'mentee' ? 'Mentee' : 'Mentor',
              content: newMessage,
              timestamp: new Date().toLocaleString(),
            },
          ]);
          setNewMessage('');
        })
        .catch((error) => console.error('Error sending message:', error));
    }
  };


  const navigate = useNavigate(); // <-- Initialize navigate
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="mentor-meetings">

    <header className="header-container">
    <div className="top-header">

      <button
        className="logo-button"
        onClick={() => navigate("/mentee-home")}
      >
        <img src={logo} alt="Logo" className="logo" />
      </button>

      <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>

      </div>
      <h1 className="welcome-message">View Interactions</h1>
    </header>
    
      <div className="message-list">
        <ul>
          {messages.map((message, index) => (
            <li key={index} className={message.sender.toLowerCase()}>
              <strong>{message.sender}:</strong> {message.content}{' '}
              <span className="timestamp">({message.timestamp})</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="message-input">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={handleSendMessage}>Send Message</button>
      </div>
    </div>
  );
}

export default InteractWithMentor;
