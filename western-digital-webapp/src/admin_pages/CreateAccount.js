//Finished
//Delete BoxC
import React, { useState, useEffect } from 'react';
import './CreateAccount.css';
import { useNavigate } from "react-router-dom";
import logo from '../assets/WDC2.png';
import logout from "../assets/logout.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import one from "../assets/one.png";
import twopeople from "../assets/twopeople.png";
import { motion } from "framer-motion";
// import AssignMentorTable from './AssignMentorTable';

function CreateAccount() {
  const navigate = useNavigate();

  // Input states
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  // Dark mode and user
  const user = JSON.parse(sessionStorage.getItem("user"));
  const adminName = user?.name || "Admin";
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Dark mode effect
  useEffect(() => {
    const savedTheme = sessionStorage.getItem("isDarkMode") === "true";
    setIsDarkMode(savedTheme);
    document.body.className = savedTheme ? "dark-mode" : "";
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.body.className = newTheme ? "dark-mode" : "";
    sessionStorage.setItem("isDarkMode", newTheme);
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

  // Simulate account creation
  const handleCreateAccount = (e) => {
    e.preventDefault();

    if (!first || !last || !email || !password || !selectedValue || !accountType) {
      setError("Please fill out all fields.");
      return;
    }

    const newAccount = {
      name: first,
      lastname: last,
      email,
      password,
      department: selectedValue,
      role: accountType,
    };

    setAccounts([...accounts, newAccount]);
    setError(null);

    // Clear form
    setFirst('');
    setLast('');
    setEmail('');
    setPassword('');
    setSelectedValue('');
    setAccountType('');
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="create-account">
        {/* Header */}
        <div className="logo-title-container">
          <img src={logo} alt="logo" className="logo" />
          <h1 className="title-header">Create Account</h1>
        </div>

        {/* Sidebar */}
        <div className="sidebarC">
          <div className="nav-buttonsC">
            <motion.button className="icon" onClick={() => navigate("/see-interactions")} whileHover={{ scale: 1.1 }}><img src={chat} alt="chat" /></motion.button>
            <motion.button className="icon" onClick={() => navigate("/view-progressions")} whileHover={{ scale: 1.1 }}><img src={write} alt="write" /></motion.button>
            <motion.button className="icon1" onClick={() => navigate("/create-account")} whileHover={{ scale: 1.1 }}><img src={one} alt="create" /></motion.button>
            <motion.button className="icon" onClick={() => navigate("/assign-mentor")} whileHover={{ scale: 1.1 }}><img src={twopeople} alt="assign" /></motion.button>
          </div>

          {/* Theme switch */}
          <div className="slider-section">
            <label className="slider-container">
              <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
              <span className="slider"></span>
            </label>
          </div>

          {/* Logout */}
          <motion.button className="logout-buttonV2" onClick={handleLogout} whileHover={{ scale: 1.1 }}>
            <img src={logout} alt="logout" />
          </motion.button>
        </div>

        {/* Form Section */}
        <div className="content-wrapperVA">
          <div className="chat-boxA">
            <form className="account-form" onSubmit={handleCreateAccount}>
              <input className="input1" type="text" placeholder="Enter First Name" value={first} onChange={(e) => setFirst(e.target.value)} />
              <input className="input1" type="text" placeholder="Enter Last Name" value={last} onChange={(e) => setLast(e.target.value)} />
              <input className="input1" type="text" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="input1" type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />

              <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
                <option value="">--Select Department--</option>
                <option value="GST">GST</option>
                <option value="FBU">FBU</option>
                <option value="WHM">WHM</option>
                <option value="MP">MP</option>
                <option value="JAPAN">Japan</option>
                <option value="WDIN">WDIN</option>
              </select>

              <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                <option value="">--Select Role--</option>
                <option value="mentee">Mentee</option>
                <option value="mentor">Mentor</option>
              </select>

              <div className="space"></div>
              <button type="submit" className="submit-button">Create Account</button>
            </form>

            {error && <p className="error">{error}</p>}

            {/* Show dummy account list */}
            <ul>
              {accounts.map((account, index) => (
                <li key={index}>
                  Account created: {account.name} {account.lastname} ({account.email}) - <strong>{account.department} / {account.role}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Welcome and To-Do */}
        <div className="welcome-box-containerA">
          <div className="welcome-boxA">
            <h2>Welcome, {adminName}!</h2>
            <p>Today is {formatDateTime(currentDateTime)}</p>
          </div>

          {/* <div className="new-boxA">
            <h2>To-Do</h2>
            <div className="assign-mentor-container">
              <AssignMentorTable />
            </div>
          </div> */}
        </div>
    </div>
  );
}

export default CreateAccount;

// import React, { useState, useEffect } from 'react';
// import './CreateAccount.css';
// import { useNavigate } from "react-router-dom";
// import logo from '../assets/WDC2.png';
// import logout from "../assets/logout.png";
// import chat from "../assets/chat.png";
// import write from "../assets/write.png";
// import one from "../assets/one.png";
// import twopeople from "../assets/twopeople.png";
// import { motion } from "framer-motion"; // Importing motion
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
// } from "@mui/material";
// import AssignMentorTable from './AssignMentorTable';
// function CreateAccount() {
//   //Initialize navigate
//   const navigate = useNavigate();
//   // States for tracking data related to mentees, mentors, assignments, and UI state

//   const [first, setFirst] = useState("");
//   const [last, setLast] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [selectedValue, setSelectedValue] = useState("");
//   const [accountType, setAccountType] = useState("");
//   const [error, setError] = useState(null);
//   const [accounts, setAccounts] = useState([]);
//   // User data and theme state
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
//   // Function to toggle dark mode theme
//   useEffect(() => {
//     const savedTheme = sessionStorage.getItem("isDarkMode") === "true"; // Retrieve state
//     setIsDarkMode(savedTheme);
//     document.body.className = savedTheme ? "dark-mode" : "";
//   }, []);
//   // date function 
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
//   const handleCreateAccount = async (e) => {
//     e.preventDefault();

//     // Construct the data object to send to the backend
//     const accountData = {
//       name: first,
//       lastname: last,
//       email,
//       password,
//       department: selectedValue,
//       role: accountType,
//     };

//     console.log('Account Data:', JSON.stringify(accountData));
//   // Function to create bew account

//     try {
//       const response = await fetch('http://localhost:3001/api/accounts/createAccount', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(accountData),
//       });

//       console.log('Response status:', response.status);

//       if (response.ok) {
//         const newAccount = await response.json();
//         setAccounts([...accounts, newAccount]);

//         // Clear input fields after creation
//         setFirst('');
//         setLast('');
//         setEmail('');
//         setPassword('');
//         setSelectedValue('');
//         setAccountType('');
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || 'Error creating account');
//       }
//     } catch (error) {
//       console.error('Error creating account:', error);
//       setError('Error creating account');
//     }
//   };



//   const handleLogout = () => {
//     sessionStorage.clear();
//     navigate("/");
//   };

//   return (
//     <div className="create-account">
// <div className="boxC">
//     <div className="logo-title-container">
//           <img src={logo} alt="logo" className="logo" />
//           <h1 className="title-header">Create Account</h1>
//     </div>
//     <div className="sidebarC">
//         {/* Navigation Buttons */}
//         <div className="nav-buttonsC">
//           <motion.button
//             className="icon"
//             onClick={() => navigate("/see-interactions")}
//             whileHover={{ scale: 1.1 }} // Growing effect on hover
//             transition={{ duration: 0.1 }}
//           >
//             <img src={chat} alt="chat" />
//           </motion.button>
//           <motion.button
//             className="icon"
//             onClick={() => navigate("/view-progressions")}
//             whileHover={{ scale: 1.1 }} // Growing effect on hover
//             transition={{ duration: 0.1 }}
//           >
//             <img src={write} alt="write" />
//           </motion.button>
//           <motion.button
//             className="icon1"
//             onClick={() => navigate("/create-account")}
//             whileHover={{ scale: 1.1 }} // Growing effect on hover
//             transition={{ duration: 0.1 }}
//           >
//             <img src={one} alt="create" />
//           </motion.button>
//           <motion.button
//             className="icon"
//             onClick={() => navigate("/assign-mentor")}
//             whileHover={{ scale: 1.1 }} // Growing effect on hover
//             transition={{ duration: 0.1 }}
//           >
//             <img src={twopeople} alt="twopeople" />
//           </motion.button>
//         </div>

//         {/* Logout Button */}
//         <div className="slider-section">
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
//       </div>

//       <div className="content-wrapperVA">
//         <div className="chat-boxA">
//           <div className="box1">
//           <div className="chat-containerA">
//           </div>
//           <div className="whiterectangle" >
//           <form className="account-form" onSubmit={handleCreateAccount}>
//             <input className='input1' 
//               type="text" 
//               value={first} 
//               placeholder="Enter First Name"
//               onChange={(e) => setFirst(e.target.value)}
//             />
//             <input className='input1' 
//               type="text" 
//               value={last} 
//               placeholder="Enter Last Name"
//               onChange={(e) => setLast(e.target.value)}
//             />
//             <input className='input1' 
//               type="text" 
//               value={email} 
//               placeholder="Enter Email"
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <input className='input1' 
//               type="password" 
//               value={password} 
//               placeholder="Enter Password"
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             {/* <h3>Department</h3> */}
//             <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
//               <option value="">--Select Department--</option>
//               <option value="GST">GST</option>
//               <option value="FBU">FBU</option>
//               <option value="WHM">WHM</option>
//               <option value="MP">MP</option>
//               <option value="JAPAN">Japan</option>
//               <option value="WDIN">WDIN</option>
//             </select>
//             {/* <h3>Role</h3> */}
//             <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
//               <option value="">--Select Role--</option>
//               <option value="mentee">Mentee</option>
//               <option value="mentor">Mentor</option>
//             </select>
//             <div className="space"></div>
//             <button type="submit" className="submit-button">Create Account</button>
//           </form>
          
//         </div>
//         {error && <p className="error">{error}</p>}
//       <ul>
//         {accounts.map((account, index) => (
//           <li key={index}>
//             {"Account created successfully:"} {account.name} {account.lastname} ({account.email}) - 
//             <strong> {account.department} / {account.role}</strong>
//           </li>
//         ))}
//       </ul>
//           </div>
//         </div>
//       </div>

//       </div>

      
      

//       {/* </div> */}


//       <div className="welcome-box-containerA">
//       {/* Welcome Message Box */}
//       <div className="welcome-boxA">
//         <h2>Welcome, {adminName}!</h2>
//         <p>Today is {formatDateTime(currentDateTime)}</p>
//       </div>

//       {/* New Box under the Welcome Box */}
//       <div className="new-boxA">
//     <h2>To-Do</h2>
//     <div className="assign-mentor-container">
//     <AssignMentorTable/>
//     </div>
//   </div>
//     </div>
//     </div>
//   );
// }

// export default CreateAccount;
