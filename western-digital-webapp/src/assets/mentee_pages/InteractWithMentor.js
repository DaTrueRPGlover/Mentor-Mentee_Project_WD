import React, { useState } from 'react';
import './InteractWithMentor.css';

function InteractWithMentor() {
  const [messages, setMessages] = useState([
    { sender: 'Mentee', content: 'Hello, I have completed the assignment.', timestamp: '2024-10-15' },
    { sender: 'Mentor', content: 'Great! Let’s review it during our next meeting.', timestamp: '2024-10-16' },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const currentDate = new Date().toISOString().split('T')[0]; // Get current date
      setMessages([...messages, { sender: 'Mentee', content: newMessage, timestamp: currentDate }]);
      setNewMessage(''); // Clear the input after sending
    }
  };

  return (
    <div className="interact-with-mentor">
      <h1>Interact with Mentor</h1>
      <div className="message-list">
        <ul>
          {messages.map((message, index) => (
            <li key={index} className={message.sender.toLowerCase()}>
              <strong>{message.sender}:</strong> {message.content} <span className="timestamp">({message.timestamp})</span>
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
