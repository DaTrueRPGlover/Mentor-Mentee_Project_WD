// src/components/ChatComponent.js

import React, { useState, useEffect } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import PropTypes from 'prop-types'; // For prop type validation
// import "./ChatComponent.css"; // Ensure this CSS file exists and is properly styled

function ChatComponent({ selectedMentee, mentorKey, userRole }) {
  const [messages, setMessages] = useState([]);
  const [menteeName, setMenteeName] = useState("");
  const [conversationKey, setConversationKey] = useState("");

  useEffect(() => {
    if (!selectedMentee) return;

    // Fetch all messages between the selected mentee and the mentor
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/messages?menteekey=${selectedMentee}&mentorkey=${mentorKey}`);
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        const formattedMessages = data.messages.map((msg) => ({
          message: msg.message_text,
          sentTime: new Date(msg.message_time).toLocaleString(),
          sender: msg.sender_role === "mentee" ? "Mentee" : "Mentor",
          direction: msg.sender_role === "mentee" ? "incoming" : "outgoing",
        }));
        setMessages(formattedMessages);
        const mentee = data.mentees.find((m) => m.menteekey === selectedMentee);
        setMenteeName(mentee?.menteeName || "Mentee");
        setConversationKey(data.conversationKey);
      } catch (error) {
        console.error("Error fetching messages:", error);
        alert("There was an error fetching the messages. Please try again later.");
      }
    };

    fetchMessages();
  }, [selectedMentee, mentorKey]);

  useEffect(() => {
    if (!conversationKey) return;

    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      ws.send(JSON.stringify({ type: "subscribe", conversation_key: conversationKey }));
    };

    ws.onmessage = (event) => {
      try {
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
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [conversationKey]);

  const handleSendMessage = async (messageText) => {
    if (messageText.trim() && selectedMentee && conversationKey) {
      const messageData = {
        conversationKey,
        menteekey: selectedMentee,
        mentorkey: mentorKey,
        senderRole: userRole.toLowerCase(),
        messageText,
      };

      try {
        const response = await fetch("http://localhost:3001/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messageData),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        alert("There was an error sending your message. Please try again.");
      }
    }
  };

  if (!selectedMentee) {
    return <p>Please select a mentee to start chatting.</p>;
  }

  return (
    <div className="chat-component">
      <MainContainer className="chat-container">
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
  );
}

ChatComponent.propTypes = {
  selectedMentee: PropTypes.string.isRequired,
  mentorKey: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default ChatComponent;
