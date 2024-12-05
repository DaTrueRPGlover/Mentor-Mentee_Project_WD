import React, { useState, useEffect } from "react";
import "./InteractWithMentee.css";
import logo from "../assets/WDC.png";
import { useNavigate } from "react-router-dom";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
 
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";

function InteractWithMentee() {
  const [messages, setMessages] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState("");
  const [menteeName, setMenteeName] = useState("");
  const [conversationKey, setConversationKey] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user || user.role.toLowerCase() !== "mentor") {
      console.error("User not logged in or not a mentor");
      return;
    }

    // Fetch all mentees assigned to this mentor
    fetch(`http://localhost:3001/api/relationships/mentees?mentorkey=${user.userId}`)
      .then((response) => response.json())
      .then((data) => {
        setMentees(data);
      })
      .catch((error) => console.error("Error fetching mentees:", error));
  }, []);

  useEffect(() => {
    if (!selectedMentee) return;

    const user = JSON.parse(sessionStorage.getItem("user"));
    const menteekey = selectedMentee;

    // Fetch all messages between the selected mentee and the mentor
    fetch(`http://localhost:3001/api/messages?menteekey=${menteekey}&mentorkey=${user.userId}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedMessages = data.messages.map((msg) => ({
          message: msg.message_text,
          sentTime: new Date(msg.message_time).toLocaleString(),
          sender: msg.sender_role === "mentee" ? "Mentee" : "Mentor",
          direction: msg.sender_role === "mentee" ? "incoming" : "outgoing",
        }));
        setMessages(formattedMessages);
        const mentee = mentees.find((m) => m.menteekey === menteekey);
        setMenteeName(mentee?.menteeName || "");
        setConversationKey(data.conversationKey);
      })
      .catch((error) => console.error("Error fetching messages:", error));
  }, [selectedMentee, mentees]);

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
          sender: newMessage.senderRole === "mentor" ? "You" : "Mentee",
          direction: newMessage.senderRole === "mentor" ? "outgoing" : "incoming",
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
    if (messageText.trim() && selectedMentee) {
      const user = JSON.parse(sessionStorage.getItem("user"));

      const messageData = {
        conversationKey,
        menteekey: selectedMentee,
        mentorkey: user.userId,
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

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="interact-with-mentee">
    <AppBar position="static" color="primary">
  <Toolbar sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
    <Button
      className="logo-button"
      onClick={() => navigate("/mentor-home")}
      sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        left: 16, 
      }}
    >
      <img src={logo} alt="Logo" style={{ height: 40 }} />
    </Button>

    <Typography 
      variant="h6" 
      sx={{ 
        flexGrow: 1, 
        textAlign: 'center', 
      }}
    >
      Interact With Mentee
    </Typography>

  
    <Button
      color="inherit"
      onClick={handleLogout}
      sx={{
        position: 'absolute',
        right: 16,
      }}
    >
      Logout
    </Button>
  </Toolbar>
</AppBar>
      
        <div className="box">
      
        {mentees.length === 0 && (
          <p className="no-mentees-message">You have no mentees assigned.</p>
        )}
        {mentees.length > 0 && (
          
          <div className="dropdown-container">
            <label htmlFor="meeting-select-mentee">Select a Mentee:</label>
            <select
              value={selectedMentee}
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
        )}
    

      {selectedMentee && (
        <div className="chat-container">
          <MainContainer>
            <ChatContainer>
              <MessageList>
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
                placeholder={`Send a message to ${menteeName}...`}
                onSend={handleSendMessage}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      )}
    </div>
      </div>

  );
}

export default InteractWithMentee;
