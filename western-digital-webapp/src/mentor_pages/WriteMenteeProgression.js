import React, { useState } from "react";
import "./WriteMenteeProgression.css";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import logo from "../assets/WDC.png";
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import MoodIcon from '@mui/icons-material/Mood';

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
  const [skippedMeeting, setSkippedMeeting] = useState(""); // Changed to empty string for consistency
  const [finishedHW, setFinishedHW] = useState(""); // Changed to empty string for consistency
  const [attitude, setAttitude] = useState(""); // New state for attitude

  const handleAddReport = () => {
    if (newMentee.trim() && newReport.trim() && newDate.trim()) {
      const newReportData = {
        mentee: newMentee,
        date: newDate,
        notes: newReport,
        skippedMeeting, // Add skipped meeting value
        finishedHW, // Add finished HW value
        attitude, // Add attitude value
      };

      console.log("New Report Submitted:", newReportData);

      setProgressReports([...progressReports, newReportData]);
      setNewMentee("");
      setNewReport("");
      setNewDate("");
      setSkippedMeeting(null); // Reset skipped meeting selection
      setFinishedHW(null); // Reset finished HW selection
      setAttitude(null); // Reset attitude selection
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // Redirect user to the home page after logout
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
        <div className="welcome-message-container">
        <h1 className="welcome-message">Write Mentee Progression</h1>
        </div>
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

         <div className="form-box">
        <div className="question-group">
        <div className="form-title">
              <EventBusyOutlinedIcon className="form-title-icon" />
              <p>Skipped Meeting?</p>
            </div>

          <input
            type="radio"
            name="skippedMeeting"
            value="Yes"
            checked={skippedMeeting === "Yes"}
            onChange={(e) => setSkippedMeeting(e.target.value)}
          />
          <label htmlFor="skippedMeetingYes">Yes</label>

          <input
            type="radio"
            name="skippedMeeting"
            value="No"
            checked={skippedMeeting === "No"}
            onChange={(e) => setSkippedMeeting(e.target.value)}
          />
          <label htmlFor="skippedMeetingNo">No</label>
        </div>
        </div>

        <div className="form-box">
        <div className="question-group">
        <div className="form-title">
        <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
          <p>Mentee Finished HW?</p>
          </div>
          <input
            type="radio"
            name="finishedHW"
            value="Yes"
            checked={finishedHW === "Yes"}
            onChange={(e) => setFinishedHW(e.target.value)}
          />
          <label htmlFor="finishedHWYes">Yes</label>

          <input
            type="radio"
            name="finishedHW"
            value="No"
            checked={finishedHW === "No"}
            onChange={(e) => setFinishedHW(e.target.value)}
          />
          <label htmlFor="finishedHWNo">No</label>
        </div>
        </div>

        <div className="form-box">
        <div className="question-group">
        <div className="form-title">
        <MoodIcon className="form-title-icon" />
          <p>Mentee's Attitude Towards Learning</p>
          </div>
          <input
            type="radio"
            id="attitude-very-good"
            name="attitude"
            value="Very Good"
            checked={attitude === "Very Good"}
            onChange={(e) => setAttitude(e.target.value)}
          />
          
          <label htmlFor="attitude-very-good">Very Good</label>
          
          <input
            type="radio"
            id="attitude-average"
            name="attitude"
            value="Average"
            checked={attitude === "Average"}
            onChange={(e) => setAttitude(e.target.value)}
          />
          <label htmlFor="attitude-average">Average</label>
          <input
            type="radio"
            id="attitude-not-good"
            name="attitude"
            value="Not Good"
            checked={attitude === "Not Good"}
            onChange={(e) => setAttitude(e.target.value)}
          />
          <label htmlFor="attitude-not-good">Not Good</label>
        </div>

        </div>
        <div class="comment-container">
        <textarea
          value={newReport}
          onChange={(e) => setNewReport(e.target.value)}
          placeholder="Extra comments here"
        />
        <button className="submit-button" onClick={handleAddReport}>
          Submit
        </button>
        </div>
      </div>
    </div>
  );
}

export default WriteMenteeProgression;
