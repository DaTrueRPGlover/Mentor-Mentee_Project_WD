// src/components/ChatBox.js
import React, { useState, useEffect } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
// import "./ChatBox.css"; // Create and style this CSS as needed

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [mentorName, setMentorName] = useState("");
  const [mentorKey, setMentorKey] = useState(null);
  const [conversationKey, setConversationKey] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    <div className="chat-box-component">
      {mentorKey ? (
        <MainContainer className="chat-container">
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
      ) : (
        <p className="no-mentor-message">You have no mentor assigned.</p>
      )}
    </div>
  );
};

export default ChatBox;
