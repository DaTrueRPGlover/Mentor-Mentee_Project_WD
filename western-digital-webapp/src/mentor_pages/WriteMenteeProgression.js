import React, { useState } from "react";
import "./WriteMenteeProgression.css";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import logo from "../assets/WDC.png";

function WriteMenteeProgression() {
  const navigate = useNavigate(); // <-- Initialize navigate

  const [progressReports, setProgressReports] = useState([
    {
      mentee: "Jane Smith",
      date: "2024-10-10",
      report: "Completed first milestone on the project.",
    },
    {
      mentee: "Mark White",
      date: "2024-10-12",
      report: "Improved communication during meetings.",
    },
  ]);

  const [newMentee, setNewMentee] = useState("");
  const [newReport, setNewReport] = useState("");
  const [newDate, setNewDate] = useState("");
  const [skippedMeeting, setSkippedMeeting] = useState(null); // For skipped meeting question
  const [finishedHW, setFinishedHW] = useState(null); // For finished HW question
  const [attitude, setAttitude] = useState(""); // New state for attitude

  const handleAddReport = () => {
    if (newMentee.trim() && newReport.trim() && newDate.trim()) {
      setProgressReports([
        ...progressReports,
        { mentee: newMentee, date: newDate, report: newReport },
      ]);
      setNewMentee("");
      setNewReport("");
      setNewDate("");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="write-mentee-progression">
      <header className="header-container">
        <div className="top-header">
          <button
            className="logo-button"
            onClick={() => navigate("/mentor-home")}
          >
            <img src={logo} alt="Logo" className="logo" />
          </button>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h1 className="welcome-message">Write Mentee Progression</h1>
      </header>

      <div className="progress-form">
        <input
          type="text"
          value={newMentee}
          onChange={(e) => setNewMentee(e.target.value)}
          placeholder="Enter mentee name"
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />

        <div className="question-group">
          <p>Skipped Meeting?</p>

          <input
            type="radio"
            name="skippedMeeting"
            value="Yes"
            checked={skippedMeeting === "Yes"}
            onChange={(e) => setSkippedMeeting(e.target.value)}
          />
          <label htmlFor="skippedMeeting">Yes</label>

          <input
            type="radio"
            name="skippedMeeting"
            value="No"
            checked={skippedMeeting === "No"}
            onChange={(e) => setSkippedMeeting(e.target.value)}
          />
          <label htmlFor="skippedMeeting">No</label>
        </div>
        <div className="question-group">
          <p>Mentee Finished HW?</p>

          <input
            type="radio"
            name="finishedHW"
            value="Yes"
            checked={finishedHW === "Yes"}
            onChange={(e) => setFinishedHW(e.target.value)}
          />
          <label htmlFor="skippedMeeting">Yes</label>

          <input
            type="radio"
            name="finishedHW"
            value="No"
            checked={finishedHW === "No"}
            onChange={(e) => setFinishedHW(e.target.value)}
          />
          <label htmlFor="skippedMeeting">No</label>
        </div>

        <div className="question-group">
          <p>Mentee's Attitude Towards Learning</p>
          <input
            type="radio"
            id="attitude-not-good"
            name="attitude"
            value="Not Good"
            onChange={(e) => setAttitude(e.target.value)}
          />
          <label htmlFor="attitude-not-good">Not Good</label>
          <input
            type="radio"
            id="attitude-average"
            name="attitude"
            value="Average"
            onChange={(e) => setAttitude(e.target.value)}
          />
          <label htmlFor="attitude-average">Average</label>
          <input
            type="radio"
            id="attitude-very-good"
            name="attitude"
            value="Very Good"
            onChange={(e) => setAttitude(e.target.value)}
          />
          <label htmlFor="attitude-very-good">Very Good</label>
        </div>

        <textarea
          value={newReport}
          onChange={(e) => setNewReport(e.target.value)}
          placeholder="Extra comments here"
        />
        <button className="submit-button" onClick={handleAddReport}>
          Submit Progress Report
        </button>
      </div>
    </div>
  );
}

export default WriteMenteeProgression;
