import React, { useState, useEffect } from "react";
import "./InteractWithMentee.css";
import logo from "../assets/WDC2.png";
import { useNavigate } from "react-router-dom";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import twopeople from "../assets/twopeople.png";
import logout from "../assets/logout.png";
import assign from "../assets/assign.png";
import hw from "../assets/hw.png";
import calendar from "../assets/calendar.png";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { motion } from "framer-motion";
import AssignHWTable from "./AssignHW.js";

function InteractWithMentee() {
  const navigate = useNavigate();
  const adminName = "Mentor Name"; // Dummy name
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  const dummyMentees = [
    { menteekey: "1", menteeName: "Alice" },
    { menteekey: "2", menteeName: "Bob" },
  ];

  const dummyMessages = {
    "1": [
      {
        message: "Hello Mentor!",
        sentTime: "2025-08-04 09:00:00",
        sender: "Mentee",
        direction: "incoming",
      },
      {
        message: "Hi Alice, how are you doing?",
        sentTime: "2025-08-04 09:01:00",
        sender: "You",
        direction: "outgoing",
      },
    ],
    "2": [
      {
        message: "Good morning!",
        sentTime: "2025-08-04 10:00:00",
        sender: "Mentee",
        direction: "incoming",
      },
    ],
  };

  const [mentees, setMentees] = useState(dummyMentees);
  const [selectedMentee, setSelectedMentee] = useState("");
  const [menteeName, setMenteeName] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const savedTheme = sessionStorage.getItem("isDarkMode") === "true";
    setIsDarkMode(savedTheme);
    document.body.className = savedTheme ? "dark-mode" : "";
  }, []);

  useEffect(() => {
    if (selectedMentee) {
      const mentee = mentees.find((m) => m.menteekey === selectedMentee);
      setMenteeName(mentee?.menteeName || "");
      setMessages(dummyMessages[selectedMentee] || []);
    }
  }, [selectedMentee]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.body.className = newTheme ? "dark-mode" : "";
    sessionStorage.setItem("isDarkMode", newTheme);
  };

  const handleSendMessage = (text) => {
    const newMessage = {
      message: text,
      sentTime: new Date().toLocaleString(),
      sender: "You",
      direction: "outgoing",
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const formatDateTime = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="interact-with-mentee">
      <div className="logo-title-container">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="title-header">Chat With Mentee</h1>
      </div>

      <div className="sidebarA">
        <div className="nav-buttonsA">
          <motion.button className="icon1" onClick={() => navigate("/interact-with-mentee")} whileHover={{ scale: 1.1 }}>
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button className="icon" onClick={() => navigate("/write-mentee-progression")} whileHover={{ scale: 1.1 }}>
            <img src={write} alt="write" />
          </motion.button>
          <motion.button className="icon" onClick={() => navigate("/assign-homework")} whileHover={{ scale: 1.1 }}>
            <img src={hw} alt="create" />
          </motion.button>
          <motion.button className="icon" onClick={() => navigate("/mentor-meetings")} whileHover={{ scale: 1.1 }}>
            <img src={calendar} alt="calendar" />
          </motion.button>
        </div>

        <div className="slider-section">
          <label className="slider-container">
            <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </div>

        <motion.button className="logout-buttonV2" onClick={handleLogout} whileHover={{ scale: 1.1 }}>
          <img src={logout} alt="logout" />
        </motion.button>
      </div>

      <div className="content-wrapperVA">
        <div className="chat-boxA">
          <div className="box1">
            {mentees.length === 0 && <p className="no-mentees-message">You have no mentees assigned.</p>}
            {mentees.length > 0 && (
              <div className="dropdown-container">
                <label htmlFor="meeting-select-mentee">Select a Mentee:</label>
                <select value={selectedMentee} onChange={(e) => setSelectedMentee(e.target.value)}>
                  <option value="" disabled>-- Select a mentee --</option>
                  {mentees.map((mentee) => (
                    <option key={mentee.menteekey} value={mentee.menteekey}>
                      {mentee.menteeName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedMentee && (
              <MainContainer className="chat-container" style={{ backgroundColor: '#FFFFFF' }}>
                <ChatContainer style={{ backgroundColor: '#FFFFFF' }}>
                  <MessageList style={{ backgroundColor: '#FFFFFF' }}>
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
            )}
          </div>
        </div>

        
      </div>
      <div className="welcome-box-containerA">
          <div className="welcome-boxA">
            <h2>Welcome, {adminName}!</h2>
            <p>Today is {formatDateTime(currentDateTime)}</p>
          </div>

          <div className="new-boxA">
            <h2>Upcoming Meetings</h2>
            <AssignHWTable />
          </div>
        </div>
    </div>
  );
}

export default InteractWithMentee;








// import React, { useState, useEffect } from "react";
// import "./InteractWithMentee.css";
// import logo from "../assets/WDC2.png";
// import { useNavigate } from "react-router-dom";
// import chat from "../assets/chat.png";
// import write from "../assets/write.png";
// import twopeople from "../assets/twopeople.png";
// import logout from "../assets/logout.png";
// import assign from "../assets/assign.png";
// import hw from "../assets/hw.png";
// import calendar from "../assets/calendar.png";
// import {
//   MainContainer,
//   ChatContainer,
//   MessageList,
//   Message,
//   MessageInput,
// } from "@chatscope/chat-ui-kit-react";
// import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
// } from "@mui/material";
// import { motion } from "framer-motion"; // Importing motion
// import AssignHWTable from "./AssignHW.js"; // Import the AssignHWTable component


// function InteractWithMentee() {
//   const [messages, setMessages] = useState([]);
//   const [mentees, setMentees] = useState([]);
//   const [selectedMentee, setSelectedMentee] = useState("");
//   const [menteeName, setMenteeName] = useState("");
//   const [conversationKey, setConversationKey] = useState("");
//   const navigate = useNavigate();
//   const user = JSON.parse(sessionStorage.getItem("user"));
//   const name = user['name']
//   const adminName = name || "Admin";
//   const [currentDateTime, setCurrentDateTime] = useState(new Date());

//   const [isDarkMode, setIsDarkMode] = useState(false);

//   const toggleTheme = () => {
//     const newTheme = !isDarkMode;
//     setIsDarkMode(newTheme);
//     document.body.className = newTheme ? "dark-mode" : "";
//     sessionStorage.setItem("isDarkMode", newTheme); // Save state
//   };
  
//   useEffect(() => {
//     const savedTheme = sessionStorage.getItem("isDarkMode") === "true"; // Retrieve state
//     setIsDarkMode(savedTheme);
//     document.body.className = savedTheme ? "dark-mode" : "";
//   }, []);
  
//   useEffect(() => {
//     const user = JSON.parse(sessionStorage.getItem("user"));

//     if (!user || user.role.toLowerCase() !== "mentor") {
//       console.error("User not logged in or not a mentor");
//       return;
//     }

//     // Fetch all mentees assigned to this mentor
//     fetch(`http://localhost:3001/api/relationships/mentees?mentorkey=${user.userId}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setMentees(data);
//       })
//       .catch((error) => console.error("Error fetching mentees:", error));
//   }, []);

//   useEffect(() => {
//     if (!selectedMentee) return;

//     const user = JSON.parse(sessionStorage.getItem("user"));
//     const menteekey = selectedMentee;

//     // Fetch all messages between the selected mentee and the mentor
//     fetch(`http://localhost:3001/api/messages?menteekey=${menteekey}&mentorkey=${user.userId}`)
//       .then((response) => response.json())
//       .then((data) => {
//         const formattedMessages = data.messages.map((msg) => ({
//           message: msg.message_text,
//           sentTime: new Date(msg.message_time).toLocaleString(),
//           sender: msg.sender_role === "mentee" ? "Mentee" : "Mentor",
//           direction: msg.sender_role === "mentee" ? "incoming" : "outgoing",
//         }));
//         setMessages(formattedMessages);
//         const mentee = mentees.find((m) => m.menteekey === menteekey);
//         setMenteeName(mentee?.menteeName || "");
//         setConversationKey(data.conversationKey);
//       })
//       .catch((error) => console.error("Error fetching messages:", error));
//   }, [selectedMentee, mentees]);
//   const formatDateTime = (date) => {
//     const options = {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     };
//     return date.toLocaleDateString("en-US", options);
//   };
//   useEffect(() => {
//     if (!conversationKey) return;

//     const ws = new WebSocket("ws://localhost:3001");

//     ws.onopen = () => {
//       console.log("WebSocket connection opened");

//       ws.send(
//         JSON.stringify({ type: "subscribe", conversation_key: conversationKey })
//       );
//     };

//     ws.onmessage = (event) => {
//       const newMessage = JSON.parse(event.data);
//       console.log("WebSocket new message:", newMessage);

//       setMessages((prevMessages) => [
//         ...prevMessages,
//         {
//           message: newMessage.message,
//           sentTime: new Date(newMessage.timestamp).toLocaleString(),
//           sender: newMessage.senderRole === "mentor" ? "You" : "Mentee",
//           direction: newMessage.senderRole === "mentor" ? "outgoing" : "incoming",
//         },
//       ]);
//     };

//     ws.onclose = () => {
//       console.log("WebSocket connection closed");
//     };

//     return () => {
//       ws.close();
//     };
//   }, [conversationKey]);

//   const handleSendMessage = async (messageText) => {
//     if (messageText.trim() && selectedMentee) {
//       const user = JSON.parse(sessionStorage.getItem("user"));

//       const messageData = {
//         conversationKey,
//         menteekey: selectedMentee,
//         mentorkey: user.userId,
//         senderRole: user.role.toLowerCase(),
//         messageText,
//       };

//       try {
//         await fetch("http://localhost:3001/api/messages", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(messageData),
//         });
//       } catch (error) {
//         console.error("Error sending message:", error);
//       }
//     }
//   };

//   const handleLogout = () => {
//     sessionStorage.clear();
//     navigate("/");
//   };

//   return (
//     <div className="interact-with-mentee">
//       <div className="logo-title-container">
//           <img src={logo} alt="logo" className="logo" />
//           <h1 className="title-header">Chat With Mentee</h1>
//       </div>
//       <div className="sidebarA">
//         {/* Navigation Buttons */}
//         <div className="nav-buttonsA">
//           <motion.button
//             className="icon1"
//             onClick={() => navigate("/interact-with-mentee")}
//             whileHover={{ scale: 1.1 }} // Growing effect on hover
//             transition={{ duration: 0.1 }}
//           >
//             <img src={chat} alt="chat" />
//           </motion.button>
//           <motion.button
//             className="icon"
//             onClick={() => navigate("/write-mentee-progression")}
//             whileHover={{ scale: 1.1 }} // Growing effect on hover
//             transition={{ duration: 0.1 }}
//           >
//             <img src={write} alt="write" />
//           </motion.button>
//           <motion.button
//             className="icon"
//             onClick={() => navigate("/assign-homework")}
//             whileHover={{ scale: 1.1 }} // Growing effect on hover
//             transition={{ duration: 0.1 }}
//           >
//             <img src={hw} alt="create" />
//           </motion.button>
//           <motion.button
//             className="icon"
//             onClick={() => navigate("/mentor-meetings")}
//             whileHover={{ scale: 1.1 }} // Growing effect on hover
//             transition={{ duration: 0.1 }}
//           >
//             <img src={calendar} alt="twopeople" />
//           </motion.button>
//                   {/* Logout Button */}
//       </div>
//       <div className="slider-section">
//           <span role="img" aria-label="Sun"></span>
//           <label className="slider-container">
//             <input
//               type="checkbox"
//               checked={isDarkMode}
//               onChange={toggleTheme}
//             />
//             <span className="slider"></span>
//           </label>
//           <span role="img" aria-label="Moon"></span>
//         </div>
//         <motion.button
//           className="logout-buttonV2"
//           onClick={handleLogout}
//           whileHover={{ scale: 1.1 }} // Growing effect on hover
//           transition={{ duration: 0.3 }}
//         >
//           <img src={logout} alt="logout" />
//         </motion.button>
//         </div>

//         <div className="content-wrapperVA">
//         <div className="chat-boxA">
//           <div className="box1">
      
//       {mentees.length === 0 && (
//         <p className="no-mentees-message">You have no mentees assigned.</p>
//       )}
//       {mentees.length > 0 && (
        
//         <div className="dropdown-container">
//           <label htmlFor="meeting-select-mentee">Select a Mentee:</label>
//           <select
//             value={selectedMentee}
//             onChange={(e) => setSelectedMentee(e.target.value)}
//           >
//             <option value="" disabled>-- Select a mentee --</option>
//             {mentees.map((mentee) => (
//               <option key={mentee.menteekey} value={mentee.menteekey}>
//                 {mentee.menteeName}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}
  

//     {selectedMentee && (
   
//         <MainContainer className="chat-container" style={{ backgroundColor: '#FFFFFF', border: 'none', outline: 'none' }}>
//           <ChatContainer style={{ backgroundColor: '#FFFFFF', border: 'none', outline: 'none' }}>
//             <MessageList style={{ backgroundColor: '#FFFFFF', border: 'none', outline: 'none' }}>
//               {messages.map((msg, index) => (
//                 <Message 
//                   key={index}
//                   model={{
//                     message: msg.message,
//                     sentTime: msg.sentTime,
//                     sender: msg.sender,
//                     direction: msg.direction,
//                   }}
//                 />
//               ))}
//             </MessageList>
//             <MessageInput style={{ backgroundColor: '#FFFFFF', border: 'none', outline: 'none' }}
//               placeholder={`Send a message to ${menteeName}...`}
//               onSend={handleSendMessage}
//             />
//           </ChatContainer>
//         </MainContainer>

//     )}
//           </div>
//         </div>
//       </div>

//     <div className="welcome-box-containerA">
//       {/* Welcome Message Box */}
//       <div className="welcome-boxA">
//         <h2>Welcome, {adminName}!</h2>
//         <p>Today is {formatDateTime(currentDateTime)}</p>
//       </div>

//       {/* New Box under the Welcome Box */}
//       <div className="new-boxA">
//         <h2>Upcoming Meetings</h2>
//         <AssignHWTable />
//       </div>
        
//     </div>
//       </div>

//   );
// }

// export default InteractWithMentee;
