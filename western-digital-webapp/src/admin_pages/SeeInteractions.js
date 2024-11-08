import React, { useState, useEffect } from 'react';
import './SeeInteractions.css';
import { useNavigate } from "react-router-dom";
import logo from '../assets/WDC.png';

function SeeInteractions() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [mentees, setMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [selectedMenteeName, setSelectedMenteeName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.role.toLowerCase() !== 'mentor') return;

    fetch(`http://localhost:3001/api/relationships/mentees?mentorkey=${user.userId}`)
      .then((response) => response.json())
      .then((data) => setMentees(data))
      .catch((error) => console.error('Error fetching mentees:', error));
  }, []);

  useEffect(() => {
    if (!selectedMentee) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const menteekey = selectedMentee;
    const mentorkey = user.userId;

    const selectedMenteeData = mentees.find(mentee => mentee.menteekey === menteekey);
    const menteeName = selectedMenteeData ? selectedMenteeData.menteeName : '';
    setSelectedMenteeName(menteeName); 

    fetch(`http://localhost:3001/api/messages?menteekey=${menteekey}&mentorkey=${mentorkey}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedMessages = data.map((msg) => ({
          sender: msg.sender_role === 'mentee' ? 'Mentee' : 'Mentor',
          content: msg.message_text,
          timestamp: new Date(msg.message_time).toLocaleString(),
        }));
        setMessages(formattedMessages);
      })
      .catch((error) => console.error('Error fetching messages:', error));
  }, [selectedMentee, mentees]);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="mentor-meetings">
      <header className="header-container">
        <div className="top-header">
          <button className="logo-button" onClick={() => navigate("/admin-home")}>
            <img src={logo} alt="Logo" className="logo" />
          </button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        <h1 className="welcome-message">View Interactions</h1>
      </header>

      <div className="search">
        <div className="filter-section">
          <h2>Search</h2>
          {mentees.length > 0 ? (
            <div>
              <label>Select a Mentee:</label>
              <select
                value={selectedMentee || ''}
                onChange={(e) => setSelectedMentee(e.target.value)}
              >
                <option value="" disabled>Select a mentee</option>
                {mentees.map((mentee) => (
                  <option key={mentee.menteekey} value={mentee.menteekey}>
                    {mentee.menteeName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p>{mentees.length === 0 ? 'No mentees available' : 'Loading mentees...'}</p>
          )}
        </div>
      </div>

      <div className="rectangle">
        {selectedMentee && (
          <div className="message-list1">
            <ul>
              {messages.map((message, index) => (
                <li
                  key={index}
                  className={`message-item ${message.sender.toLowerCase() === 'mentee' ? 'mentee' : 'mentor'}`}
                >
                  {message.sender === 'Mentee' ? (
                    <>
                      <strong>{message.sender}:</strong> {message.content}
                      <span className="timestamp">({message.timestamp})</span>
                      <span className="mentee-name">{selectedMenteeName}</span>
                    </>
                  ) : (
                    <>
                      <span className="mentor-name">{selectedMenteeName}</span>
                      <strong>{message.sender}:</strong> {message.content}
                      <span className="timestamp">({message.timestamp})</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeeInteractions;
