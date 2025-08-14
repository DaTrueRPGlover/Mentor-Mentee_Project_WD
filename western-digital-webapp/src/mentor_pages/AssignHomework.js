// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import './AssignHomework.css';
// import logo from "../assets/WDC2.png";
// import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
// import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
// import MoodIcon from '@mui/icons-material/Mood';
// import chat from "../assets/chat.png";
// import write from "../assets/write.png";
// import twopeople from "../assets/twopeople.png";
// import logout from "../assets/logout.png";
// import hw from "../assets/hw.png";
// import calendar from "../assets/calendar.png";
// import { AppBar, Toolbar, Typography, Button } from "@mui/material";
// import { motion } from "framer-motion";
// import AssignHWTable from "./AssignHW.js";

// function AssignHomework() {
//   const navigate = useNavigate();
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [assignedDate, setAssignedDate] = useState('');
//   const [assignedTime, setAssignedTime] = useState('');
//   const [dueDate, setDueDate] = useState('');
//   const [dueTime, setDueTime] = useState('');
//   const [selectedMentees, setSelectedMentees] = useState([]);
//   const [mentees, setMentees] = useState([]);
//   const [currentDateTime, setCurrentDateTime] = useState(new Date());
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   const mentorName = "Mentor John";

//   const toggleTheme = () => {
//     const newTheme = !isDarkMode;
//     setIsDarkMode(newTheme);
//     document.body.className = newTheme ? "dark-mode" : "";
//     sessionStorage.setItem("isDarkMode", newTheme);
//   };

//   useEffect(() => {
//     const savedTheme = sessionStorage.getItem("isDarkMode") === "true";
//     setIsDarkMode(savedTheme);
//     document.body.className = savedTheme ? "dark-mode" : "";

//     const now = new Date();
//     const currentDate = now.toISOString().split('T')[0];
//     const currentTime = now.toTimeString().split(':').slice(0, 2).join(':');
//     setAssignedDate(currentDate);
//     setAssignedTime(currentTime);

//     // Dummy mentees data
//     setMentees([
//       { menteekey: "1", menteeName: "John Doe" },
//       { menteekey: "2", menteeName: "Jane Smith" },
//     ]);
//   }, []);

//   const handleAssignHomework = () => {
//     if (!title || !description || !assignedDate || !assignedTime || !dueDate || !dueTime || selectedMentees.length === 0) {
//       alert("Please fill out all fields and select at least one mentee.");
//       return;
//     }

//     const homeworkData = {
//       title,
//       description,
//       assignedDateTime: `${assignedDate} ${assignedTime}`,
//       dueDateTime: `${dueDate} ${dueTime}`,
//       mentees: selectedMentees,
//     };

//     console.log("Dummy Homework Assigned:", homeworkData);
//     alert('Homework assigned (dummy)!');
//   };

//   const handleMenteeSelection = (menteeId) => {
//     setSelectedMentees((prevSelected) =>
//       prevSelected.includes(menteeId)
//         ? prevSelected.filter((id) => id !== menteeId)
//         : [...prevSelected, menteeId]
//     );
//   };

//   const handleLogout = () => {
//     sessionStorage.clear();
//     navigate("/");
//   };

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

//   return (
//     <div className="assign-hw">
//       <div className="logo-title-container">
//         <img src={logo} alt="logo" className="logo" />
//         <h1 className="title-header">Assign Homework</h1>
//       </div>
//       <div className="sidebarA">
//         <div className="nav-buttonsA">
//           <motion.button className="icon" onClick={() => navigate("/interact-with-mentee")} whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
//             <img src={chat} alt="chat" />
//           </motion.button>
//           <motion.button className="icon" onClick={() => navigate("/write-mentee-progression")} whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
//             <img src={write} alt="write" />
//           </motion.button>
//           <motion.button className="icon1" onClick={() => navigate("/assign-homework")} whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
//             <img src={hw} alt="create" />
//           </motion.button>
//           <motion.button className="icon" onClick={() => navigate("/mentor-meetings")} whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
//             <img src={calendar} alt="calendar" />
//           </motion.button>
//         </div>
//         <div className="slider-section">
//           <label className="slider-container">
//             <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
//             <span className="slider"></span>
//           </label>
//         </div>
//         <motion.button className="logout-buttonV2" onClick={handleLogout} whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
//           <img src={logout} alt="logout" />
//         </motion.button>
//       </div>
//       <div className="content-wrapperVA">
//         <div className="chat-boxA">
//           <div className="box1">
//             <div className="box">
//               <div className="main-content">
//                 <div className="homework-body">
//                   <div className="homework-form">
//                     <input type="text" placeholder="Homework Title" value={title} onChange={(e) => setTitle(e.target.value)} className="homework-input title-input" />
//                     <textarea placeholder="Homework Description" value={description} onChange={(e) => setDescription(e.target.value)} className="homework-input description-input" />
//                     <div className="date-time-container">
//                       <label>Assigned Date and Time</label>
//                       <input type="date" value={assignedDate} onChange={(e) => setAssignedDate(e.target.value)} className="date-input" />
//                       <input type="time" value={assignedTime} onChange={(e) => setAssignedTime(e.target.value)} className="time-input" />
//                     </div>
//                     <div className="date-time-container">
//                       <label>Due Date and Time</label>
//                       <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="date-input" />
//                       <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="time-input" />
//                     </div>
//                     <div className="mentees-container">
//                       <h3>Select Mentees</h3>
//                       <div className="mentee-list">
//                         {mentees.map((mentee) => (
//                           <div key={mentee.menteekey} className="mentee-item">
//                             <label>
//                               <input type="checkbox" checked={selectedMentees.includes(mentee.menteekey)} onChange={() => handleMenteeSelection(mentee.menteekey)} />
//                               {mentee.menteeName}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <button onClick={handleAssignHomework} disabled={!title || !description || !assignedDate || !assignedTime || !dueDate || !dueTime || selectedMentees.length === 0} className="homework-button">Assign Homework</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//       </div>
//       <div className="welcome-box-containerA">
//           <div className="welcome-boxA">
//             <h2>Welcome, {mentorName}!</h2>
//             <p>Today is {formatDateTime(currentDateTime)}</p>
//           </div>
//           <div className="new-boxA">
//             <h2>Upcoming Meetings</h2>
//             <AssignHWTable />
//           </div>
//         </div>
//     </div>
//   );
// }

// export default AssignHomework;











import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './AssignHomework.css';
import logo from "../assets/WDC2.png";
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import MoodIcon from '@mui/icons-material/Mood';
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import twopeople from "../assets/twopeople.png";
import logout from "../assets/logout.png";
import hw from "../assets/hw.png";
import calendar from "../assets/calendar.png";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
}  from "@mui/material";
import { motion } from "framer-motion"; // Importing motion
// import AssignHWTable from "./AssignHWTable"; // Import the AssignHWTable component
import AssignHWTable from "./AssignHW.js"; // Import the ChatComponent

function AssignHomework() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedDate, setAssignedDate] = useState('');
  const [assignedTime, setAssignedTime] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [selectedMentees, setSelectedMentees] = useState([]);
  const [mentees, setMentees] = useState([]);
  const userInfo = JSON.parse(sessionStorage.getItem('user'));
  const mentorKey = userInfo.mentorkey;
  const user = JSON.parse(sessionStorage.getItem("user"));
  const name = user['name']
  console.log(user);
  console.log(name)
  const mentorName = name || "Mentor";
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [menteeName, setMenteeName] = useState("");
  const [conversationKey, setConversationKey] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.body.className = newTheme ? "dark-mode" : "";
    sessionStorage.setItem("isDarkMode", newTheme); // Save state
  };
  
  useEffect(() => {
    const savedTheme = sessionStorage.getItem("isDarkMode") === "true"; // Retrieve state
    setIsDarkMode(savedTheme);
    document.body.className = savedTheme ? "dark-mode" : "";
  }, []);
  
  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/relationships/mentees?mentorkey=${mentorKey}');
        if (response.ok) {
          const menteesData = await response.json();
          setMentees(menteesData);
        } else {
          throw new Error('Failed to fetch mentees');
        }
      } catch (error) {
        console.error('Error fetching mentees:', error);
      }
    };
    fetchMentees();

    // Set default assigned date and time
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const currentTime = now.toTimeString().split(':').slice(0, 2).join(':'); // Format: HH:MM
    setAssignedDate(currentDate);
    setAssignedTime(currentTime);
  }, [mentorKey]);

  const handleAssignHomework = async () => {
    if (!title || !description || !assignedDate || !assignedTime || !dueDate || !dueTime || selectedMentees.length === 0) {
      alert("Please fill out all fields and select at least one mentee.");
      return;
    }
  
    const homeworkData = {
      title,
      description,
      assignedDateTime: `${assignedDate} ${assignedTime}`,
      dueDateTime: `${dueDate} ${dueTime}`, 
      mentees: selectedMentees,
      mentorKey,
    };
  
    console.log("Homework Data to Send:", homeworkData); // Debugging log
  
    try {
      const response = await fetch('http://localhost:3001/api/homework/assign-homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homeworkData),
      });
      if (response.ok) {
        alert('Homework assigned successfully!');
        setTitle('');
        setDescription('');
        setAssignedDate('');
        setAssignedTime('');
        setDueDate('');
        setDueTime('');
        setSelectedMentees([]);
      } else {
        throw new Error('Failed to assign homework');
      }
    } catch (error) {
      console.error('Error assigning homework:', error);
    }
  };
  const formatDateTime = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleMenteeSelection = (menteeId) => {
    setSelectedMentees((prevSelected) =>
      prevSelected.includes(menteeId) ? prevSelected.filter((id) => id !== menteeId) : [...prevSelected, menteeId]
    );
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };


  return (
    <div className="assign-homework">
     <div className="logo-title-container">
          <img src={logo} alt="logo" className="logo" />
          <h1 className="title-header">Assign Homework</h1>
      </div>
      <div className="sidebarA">
        {/* Navigation Buttons */}
        <div className="nav-buttonsA">
          <motion.button
            className="icon"
            onClick={() => navigate("/interact-with-mentee")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={chat} alt="chat" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/write-mentee-progression")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={write} alt="write" />
          </motion.button>
          <motion.button
            className="icon1"
            onClick={() => navigate("/assign-homework")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={hw} alt="create" />
          </motion.button>
          <motion.button
            className="icon"
            onClick={() => navigate("/mentor-meetings")}
            whileHover={{ scale: 1.1 }} // Growing effect on hover
            transition={{ duration: 0.1 }}
          >
            <img src={calendar} alt="twopeople" />
          </motion.button>
                  {/* Logout Button */}
      </div>

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

        <div className="content-wrapperVA">
        <div className="chat-boxA">
          <div className="box1">
          <div className="box">
        
          <div className="main-content">

      <div className="homework-body">
        <div className="homework-form">
          <input type="text" placeholder="Homework Title" value={title} onChange={(e) => setTitle(e.target.value)} className="homework-input title-input" />
          <textarea placeholder="Homework Description" value={description} onChange={(e) => setDescription(e.target.value)} className="homework-input description-input" />

          <div className="date-time-container">
            <label>Assigned Date and Time</label>
            <input type="date" value={assignedDate} onChange={(e) => setAssignedDate(e.target.value)} className="date-input" />
            <input type="time" value={assignedTime} onChange={(e) => setAssignedTime(e.target.value)} className="time-input" />
          </div>

          <div className="date-time-container">
            <label>Due Date and Time</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="date-input" />
            <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="time-input" />
          </div>

          <div className="mentees-container">
            <h3>Select Mentees</h3>
            <div className="mentee-list">
              {mentees.map((mentee) => (
                <div key={mentee.menteekey} className="mentee-item">
                  <label>
                    <input type="checkbox" checked={selectedMentees.includes(mentee.menteekey)} onChange={() => handleMenteeSelection(mentee.menteekey)} />
                    {mentee.menteeName}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleAssignHomework} disabled={!title || !description || !assignedDate || !assignedTime || !dueDate || !dueTime || selectedMentees.length === 0} className="homework-button">Assign Homework</button>
        </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>

      <div className="welcome-box-containerA">
      {/* Welcome Message Box */}
      <div className="welcome-boxA">
        <h2>Welcome, {mentorName}!</h2>
        <p>Today is {formatDateTime(currentDateTime)}</p>
      </div>

      {/* New Box under the Welcome Box */}
      <div className="new-boxA">
        <h2>Upcoming Meetings</h2>
        <AssignHWTable/>
      </div>
    </div>
    </div>
  );
}

export default AssignHomework;