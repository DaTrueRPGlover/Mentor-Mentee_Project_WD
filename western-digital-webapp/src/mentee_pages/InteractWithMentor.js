import React, { useState, useEffect } from "react";
import "./InteractWithMentor.css";
import logo from "../assets/WDC.png";
import { useNavigate } from "react-router-dom";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

function InteractWithMentor() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [mentorName, setMentorName] = useState("");
  const [mentorKey, setMentorKey] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role.toLowerCase() !== "mentee") {
      console.error("User not logged in or not a mentee");
      return;
    }

    // Fetch the mentor assigned to the mentee
    fetch(
      `http://localhost:3001/api/relationships/mentor?menteekey=${user.userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error || data.length === 0) {
          console.error("Error fetching mentor:", data.error);
          return;
        }

        setMentorKey(data[0].mentorkey);
        setMentorName(data[0].mentor_name); // Assuming mentor_name is returned
        // Fetch messages with the mentor
        fetch(
          `http://localhost:3001/api/messages?menteekey=${user.userId}&mentorkey=${data[0].mentorkey}`
        )
          .then((response) => response.json())
          .then((data) => {
            const formattedMessages = data.map((msg) => ({
              message: msg.message_text,
              sentTime: new Date(msg.message_time).toLocaleString(),
              sender: msg.sender_role === "mentee" ? "You" : "Mentor",
              direction: msg.sender_role === "mentee" ? "outgoing" : "incoming",
            }));
            setMessages(formattedMessages);
          })
          .catch((error) => console.error("Error fetching messages:", error));
      })
      .catch((error) => console.error("Error fetching mentor:", error));
  }, []);

  const handleSendMessage = async (messageText) => {
    if (messageText.trim()) {
      const user = JSON.parse(localStorage.getItem("user"));

      const messageData = {
        menteekey: user.userId,
        mentorkey: mentorKey,
        senderRole: user.role.toLowerCase(),
        messageText,
      };

      try {
        await fetch("http://localhost:3001/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messageData),
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: messageText,
            sentTime: new Date().toLocaleString(),
            sender: "You",
            direction: "outgoing",
          },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="assign-mentor">
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
        <div className="container">
          <h1 className="welcome-message">Interact With Mentor</h1>
          {mentorName && (
            <p className="mentor-name">Chatting with: {mentorName}</p>
          )}
        </div>
      </header>
      {mentorKey && (
        <div className="chat-container">
          <MainContainer>
            <ChatContainer>
              <MessageList
                typingIndicator={
                  isTyping ? <TypingIndicator content="Mentor is typing..." /> : null
                }
              >
                {messages.map((msg, index) => (
                  <Message
                    key={index}
                    model={{
                      message: msg.message,
                      sentTime: msg.sentTime,
                      sender: msg.sender,
                      direction: msg.direction,
                    }}
                  />
                ))}
              </MessageList>
              <MessageInput
                placeholder="Type your message here..."
                onSend={handleSendMessage}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      )}
      {!mentorKey && (
        <p className="no-mentor-message">You have no mentor assigned.</p>
      )}
    </div>
  );
}

export default InteractWithMentor;
