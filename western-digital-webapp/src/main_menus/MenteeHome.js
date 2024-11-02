import React from "react";
import { useNavigate } from "react-router-dom";
import "./MenteeHome.css";

import logo from "../assets/WDC.png";
import talk from "../assets/talk.png";
import one from "../assets/one.png";
import notes from "../assets/notes.png";
import calendar from "../assets/schedule.png";


function MenteeHome() {
  const navigate = useNavigate();
  const menteeName = localStorage.getItem("menteeName") || "Mentee";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="mentee-home">
      <header className="header-container">
        <div className="top-header">
          <img src={logo} alt="Logo" className="logo" />
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <h1 className="welcome-message">Welcome Mentee {menteeName}</h1>
      </header>

      <main className="main-content">
        <div className="button-container">

          <button
            className="circle"
            onClick={() => navigate("/interact-mentor")}
          >
            <img src={talk} alt="Talk" className="circle-image" />
            <h3 className="title">Interact with Mentor</h3>
          </button>

          <button
            className="circle"
            onClick={() => navigate("/todo-progression")}
          >
            <img src={notes} alt="Notes" className="circle-image" />
            <h3 className="title">TO-DO/Progressions</h3>
          </button>

          <button
            className="circle"
            onClick={() => navigate("/mentee-meetings")}
          >
            <img src={one} alt="One" className="circle-image" />
            <h3 className="title">Mentor Meetings</h3>
          </button>

          <button
            className="circle"
            onClick={() => navigate("/interact-mentor")}
          >
            <img src={calendar} alt="Calendar" className="circle-image" />
            <h3 className="title">View Calendar</h3>
          </button>

        </div>
      </main>
    </div>
  );
}

export default MenteeHome;
