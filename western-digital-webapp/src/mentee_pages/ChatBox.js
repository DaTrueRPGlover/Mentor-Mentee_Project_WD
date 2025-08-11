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

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [mentorName, setMentorName] = useState("");
  const [mentorKey, setMentorKey] = useState(null);
  const [conversationKey, setConversationKey] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // ---- INLINE MOCK DATA ----
  const MOCK_RELATIONSHIP = {
    mentorkey: 2001,
    mentor_name: "Alex Mentor",
  };

  const MOCK_CONVERSATION = {
    conversationKey: "conv_abc123",
    messages: [
      {
        message_text: "Hey! Welcome to the mentorship chat 👋",
        message_time: "2025-08-10T09:00:00Z",
        sender_role: "mentor",
      },
      {
        message_text: "Feel free to send your questions anytime.",
        message_time: "2025-08-10T09:01:10Z",
        sender_role: "mentor",
      },
      {
        message_text: "Thanks! I’ll start with today’s homework doubts.",
        message_time: "2025-08-10T09:02:25Z",
        sender_role: "mentee",
      },
    ],
  };

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  // --------------------------

  useEffect(() => {
    // We no longer gate on sessionStorage; always load mocks for this page.
    (async () => {
      try {
        await delay(300); // simulate latency
        setMentorKey(MOCK_RELATIONSHIP.mentorkey);
        setMentorName(MOCK_RELATIONSHIP.mentor_name);

        await delay(250); // simulate latency
        setConversationKey(MOCK_CONVERSATION.conversationKey);
        const formatted = MOCK_CONVERSATION.messages.map((msg) => ({
          message: msg.message_text,
          sentTime: new Date(msg.message_time).toLocaleString(),
          sender: msg.sender_role === "mentee" ? "You" : "Mentor",
          direction: msg.sender_role === "mentee" ? "outgoing" : "incoming",
        }));
        setMessages(formatted);
      } catch (e) {
        console.error("Error loading mock data:", e);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  // Simulate occasional mentor typing + a canned reply once on mount
  useEffect(() => {
    if (!conversationKey) return;

    const typingTimer = setTimeout(() => setIsTyping(true), 1200);
    const replyTimer = setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          message: "Got it. Can you share where you got stuck?",
          sentTime: new Date().toLocaleString(),
          sender: "Mentor",
          direction: "incoming",
        },
      ]);
    }, 2600);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(replyTimer);
    };
  }, [conversationKey]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Append your outgoing message immediately
    setMessages((prev) => [
      ...prev,
      {
        message: messageText,
        sentTime: new Date().toLocaleString(),
        sender: "You",
        direction: "outgoing",
      },
    ]);

    // Simulate mentor typing + quick auto-reply
    setIsTyping(true);
    await delay(800);
    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        message: "Thanks for the context! Let's walk through it step-by-step.",
        sentTime: new Date().toLocaleString(),
        sender: "Mentor",
        direction: "incoming",
      },
    ]);
  };

  if (!isReady) {
    return <p className="no-mentor-message">Loading chat…</p>;
  }

  return (
    <div className="chat-box-component">
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
    </div>
  );
};

export default ChatBox;
