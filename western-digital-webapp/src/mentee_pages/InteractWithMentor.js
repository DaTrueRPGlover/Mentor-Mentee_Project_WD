import React, { useState, useEffect } from "react";
import "./InteractWithMentor.css";
import logo from "../assets/WDC2.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import assign from "../assets/assign.png";
import calendar from "../assets/calendar.png";
import logout from "../assets/logout.png";

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
import { Widgets, WidthFull } from "@mui/icons-material";
import { motion } from "framer-motion"; // Importing motion



function InteractWithMentor() {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const user = JSON.parse(sessionStorage.getItem("user"));
  const name = user['name']
  console.log(user);
  console.log(name)
  const menteeName = name|| "Mentee";

  const [messages, setMessages] = useState([]);
  const [mentorName, setMentorName] = useState("");
  const [mentorKey, setMentorKey] = useState(null);
  const [conversationKey, setConversationKey] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.className = isDarkMode ? "" : "dark-mode";
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

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
        setMentorName(data[0].mentor_name);

        // Fetch messages with the mentor
        fetch(
          `http://localhost:3001/api/messages?menteekey=${user.userId}&mentorkey=${data[0].mentorkey}`
        )
          .then((response) => response.json())
          .then((data) => {
            setConversationKey(data.conversationKey);
            const formattedMessages = data.messages.map((msg) => ({
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

  useEffect(() => {
    if (!conversationKey) return;

    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("WebSocket connection opened");

      ws.send(
        JSON.stringify({ type: "subscribe", conversation_key: conversationKey })
      );
    };

    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      console.log("WebSocket new message:", newMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: newMessage.message,
          sentTime: new Date(newMessage.timestamp).toLocaleString(),
          sender: newMessage.senderRole === "mentee" ? "You" : "Mentor",
          direction:
            newMessage.senderRole === "mentee" ? "outgoing" : "incoming",
        },
      ]);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [conversationKey]);

  const handleSendMessage = async (messageText) => {
    if (messageText.trim()) {
      const user = JSON.parse(sessionStorage.getItem("user"));

      const messageData = {
        conversationKey,
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
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };



  return (
    <div className="interact-with-mentor">

       <div className="logo-title-container">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="title-header">Chat With Mentor</h1>
      </div>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Navigation Buttons */}
          <div className="nav-buttons">
          <motion.button
            className="icon1"
            onClick={() => navigate("/interact-mentor")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/todo-progression")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={write} alt="write" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/check-hw")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={assign} alt="assign" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/mentee-meetings")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={calendar} alt="calendar" />
          </motion.button>
       
        </div>

        {/* Logout Button */}
        <div className="slider-section">
          <span role="img" aria-label="Sun"></span>
          <label className="slider-container">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
          <span role="img" aria-label="Moon"></span>
        </div>
        <motion.button
          className="logout-buttonV2"
          onClick={handleLogout}
          whileHover={{ scale: 1.1 }} // Growing effect on hover
          transition={{ duration: 0.3 }}
        >
          <img src={logout} alt="logout" />
        </motion.button>
      </div>

      {/* Content Wrapper for Welcome Message and Chat Box */}
      <div className="content-wrapperV2">
        {/* Chat Box */}
        <div className="chat-box">
          <div className="box">
        



            {mentorKey && (
            
                <MainContainer className = "chat-container" style = {{backgroundColor: '#b9bec0', border: 'none', outline: 'none'}}>
                  <ChatContainer style={{backgroundColor: '#b9bec0', border: 'none', outline: 'none'}}>
                    <MessageList style={{backgroundColor: '#b9bec0', border: 'none', outline: 'none'}}
                      typingIndicator={
                        isTyping ? <TypingIndicator content="Mentor is typing..." /> : null
                      }
                    >
                      {messages.map((msg, index) => (
                        <Message style={{backgroundColor: '#b9bec0', border: 'none', outline: 'none'}}
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
                    <MessageInput style={{backgroundColor: '#b9bec0', border: 'none', outline: 'none'}}
                      placeholder="Type your message here..."
                      onSend={handleSendMessage}
                    />
                  </ChatContainer>
                </MainContainer>
           
            )}
            {!mentorKey && <p className="no-mentor-message">You have no mentor assigned.</p>}
          </div>
        </div>

       
        </div>
            {/* Welcome and New Boxes Container */}
    <div className="welcome-box-container">
      {/* Welcome Message Box */}
      <div className="welcome-box">
        <h2>Welcome, {menteeName}!</h2>
        <p>Today Is 12/06/2024</p>
      </div>

      {/* New Box under the Welcome Box */}
      <div className="new-box">
        <h2>To-Do</h2>
        <p>placeholder For To-Do</p>
      </div>
    </div>
  </div>

  );
}

export default InteractWithMentor;
