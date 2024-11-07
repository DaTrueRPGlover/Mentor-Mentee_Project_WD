// InteractWithMentee.js
import React, { useState, useEffect } from 'react';
import './InteractWithMentee.css';

function InteractWithMentee() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [mentees, setMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.role.toLowerCase() !== 'mentor') {
      console.error('User not logged in or not a mentor');
      return;
    }

    // Fetch mentees assigned to the mentor
    fetch(`http://localhost:3001/api/relationships/mentees?mentorkey=${user.userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched mentees:', data);
        setMentees(data);
      })
      .catch((error) => console.error('Error fetching mentees:', error));
  }, []);

  useEffect(() => {
    if (!selectedMentee) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const menteekey = selectedMentee;
    const mentorkey = user.userId;

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
  }, [selectedMentee]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedMentee) {
      const user = JSON.parse(localStorage.getItem('user'));
      const menteekey = selectedMentee;
      const mentorkey = user.userId;

      const messageData = {
        menteekey: menteekey,
        mentorkey: mentorkey,
        senderRole: user.role.toLowerCase(),
        messageText: newMessage,
      };

      fetch('http://localhost:3001/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: 'Mentor',
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
      <h1>Interact with Mentees</h1>
      {mentees.length > 0 ? (
        <div>
          <label>Select a Mentee:</label>
          <select
            value={selectedMentee || ''}
            onChange={(e) => setSelectedMentee(e.target.value)}
          >
            <option value="" disabled>
              Select a mentee
            </option>
            {mentees.map((mentee) => (
              <option key={mentee.menteekey} value={mentee.menteekey}>
                {mentee.menteeName}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>You have no mentees assigned.</p>
      )}
      {selectedMentee && (
        <>
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
        </>
      )}
    </div>
  );
}

export default InteractWithMentee;
