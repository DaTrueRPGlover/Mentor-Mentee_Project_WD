import React from 'react';
import './InteractWithMentor.css'; // Import the CSS file

function InteractWithMentor() {
  return (
    <div className="interact-with-mentor">
      <h1>Interact with Mentor</h1>
      <p>This is where you can interact with your mentor.</p>
      <div className="chat-box">
        <textarea placeholder="Type your message to your mentor..."></textarea>
        <button>Send Message</button>
      </div>
    </div>
  );
}

export default InteractWithMentor;
