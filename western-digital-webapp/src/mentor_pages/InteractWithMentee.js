// InteractWithMentee.js
import React, { useState, useEffect } from 'react';
import './InteractWithMentee.css';

function InteractWithMentee() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
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

    fetch(`http://localhost:3001/messages?menteekey=${menteekey}&mentorkey=${mentorkey}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedMessages = data.map((msg) => ({
          sender: msg.isMentee ? 'Mentee' : 'Mentor',
          content: msg.isMentee ? msg.menteetext : msg.mentortext,
          timestamp: new Date(msg.date).toLocaleString(),
        }));
        setMessages(formattedMessages);
      })
      .catch((error) => console.error('Error fetching messages:', error));
  }, []);

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

  return (
    <div className="interact-with-mentee">
      <h1>Interact with {JSON.parse(localStorage.getItem('user')).role.toLowerCase() === 'mentee' ? 'Mentor' : 'Mentee'}</h1>
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

export default InteractWithMentee;
