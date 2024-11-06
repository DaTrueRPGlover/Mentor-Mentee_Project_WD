// InteractWithMentee.js
import React, { useState, useEffect } from 'react';
import './InteractWithMentee.css';

function InteractWithMentee() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [menteekey, setMenteeKey] = useState(null);
  const [mentorkey, setMentorKey] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      console.error('User not logged in');
      return;
    }

    console.log('User:', user);



    // Fetch the other key
    fetch(`http://localhost:3001/api/relationships?userid=${user.userId}&role=${user.role}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched relationship:', data);
        if (data.error) {
          console.error('Error fetching relationship:', data.error);
          return;
        }
        setMentorKey(user.userId);
        setMenteeKey(data.menteekey);
        console.log("emntee check",menteekey)
        console.log("mentor check",mentorkey)
        if (!menteekey || !mentorkey) {
          console.error('Keys not found after fetching relationship');
          return;
        }

        // Now fetch messages
        fetch(`http://localhost:3001/api/messages?menteekey=${menteekey}&mentorkey=${mentorkey}`)
          .then((response) => response.json())
          .then((data) => {
            console.log('Fetched messages:', data);
            const formattedMessages = data.map((msg) => ({
              sender: msg.sender_role === 'mentee' ? 'Mentee' : 'Mentor',
              content: msg.message_text,
              timestamp: new Date(msg.message_time).toLocaleString(),
            }));
            setMessages(formattedMessages);
          })
          .catch((error) => console.error('Error fetching messages:', error));
      })
      .catch((error) => console.error('Error fetching relationship:', error));
  }, [menteekey, mentorkey]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const user = JSON.parse(localStorage.getItem('user'));
  
      if (!user) {
        console.error('User not logged in');
        return;
      }
      console.log(menteekey)
      console.log(mentorkey)
      if (!menteekey || !mentorkey) {
        console.error('Keys not found');
        return;
      }

      const messageData = {
        menteekey: menteekey,
        mentorkey: mentorkey,
        senderRole: user.role.toLowerCase(),
        messageText: newMessage,
      };

      console.log('Sending message with data:', messageData);

      fetch('http://localhost:3001/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Message sent:', data);
          setMessages((prevMessages) => [
            ...prevMessages,
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
