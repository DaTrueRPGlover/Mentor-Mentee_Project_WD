import React, { useEffect, useState } from 'react';
import './InteractWithMentor.css';
import logo from "../assets/WDC.png"; // Adjust the path as needed

function InteractWithMentor() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      const role = user.role.toLowerCase();
      const key = role === 'mentee' ? user.menteekey : user.mentorkey;

      fetch(`http://localhost:3001/messages?role=${role}&key=${key}`)
        .then((response) => response.json())
        .then((data) => setMessages(data))
        .catch((error) => console.error('Error fetching messages:', error));
    }
  }, [user]);

  const handleSendMessage = () => {
    const messageData = {
      isMentee: user.role.toLowerCase() === 'mentee',
      isMentor: user.role.toLowerCase() === 'mentor',
      menteekey: user.menteekey,
      mentorkey: user.mentorkey,
      menteetext: user.role.toLowerCase() === 'mentee' ? newMessage : null,
      mentortext: user.role.toLowerCase() === 'mentor' ? newMessage : null,
    };

    fetch('http://localhost:3001/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    })
      .then((response) => response.json())
      .then(() => {
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
            <li key={index} className={message.sender_role.toLowerCase()}>
              <strong>{message.sender_role}:</strong> {message.message_text}{' '}
              <span className="timestamp">({message.message_time})</span>
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
