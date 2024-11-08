// InteractWithMentor.js
import React, { useState, useEffect } from 'react';
import './InteractWithMentor.css';

function InteractWithMentor() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [mentorKey, setMentorKey] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.role.toLowerCase() !== 'mentee') {
      console.error('User not logged in or not a mentee');
      return;
    }

    // Fetch the mentor assigned to the mentee
    fetch(`http://localhost:3001/api/relationships/mentor?menteekey=${user.userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched mentor:', data);
        if (data.error) {
          console.error('Error fetching mentor:', data.error);
          return;
        }

        if (data.length === 0) {
          console.error('No mentor assigned to this mentee');
          return;
        }

        setMentorKey(data[0].mentorkey);

        // Fetch messages with the mentor
        fetch(`http://localhost:3001/api/messages?menteekey=${user.userId}&mentorkey=${data[0].mentorkey}`)
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
      .catch((error) => console.error('Error fetching mentor:', error));
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user) {
        console.error('User not logged in');
        return;
      }

      if (!user.userId || !mentorKey) {
        console.error('Keys not found');
        return;
      }

      const messageData = {
        menteekey: user.userId,
        mentorkey: mentorKey,
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
              sender: 'Mentee',
              content: newMessage,
              timestamp: new Date().toLocaleString(),
            },
          ]);
          setNewMessage('');
        })
        .catch((error) => console.error('Error sending message:', error));
    }
  };
  //rendering all the infromation onto the page
  return (
    <div className="interact-with-mentor">
      <h1>Interact with Mentor</h1>
      {mentorKey ? (
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
      ) : (
        <p>You have no mentor assigned.</p>
      )}
    </div>
  );
}

export default InteractWithMentor;
