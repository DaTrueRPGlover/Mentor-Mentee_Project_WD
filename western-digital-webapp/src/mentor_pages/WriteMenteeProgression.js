import React, { useState } from "react";
import "./WriteMenteeProgression.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/WDC.png";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import MoodIcon from "@mui/icons-material/Mood";

function WriteMenteeProgression() {
  //Initialize navigate
  const navigate = useNavigate();

  //Store user input by intializing state variables
  const [mentee, setMentee] = useState("");
  const [date, setDate] = useState("");
  const [skippedMeeting, setSkippedMeeting] = useState("");
  const [finishedHW, setFinishedHW] = useState("");
  const [attitude, setAttitude] = useState("");
  const [comments, setComments] = useState("");

  const [note, setNote] = useState([]);

  const handleInsertMentorNotes = async (e) => {
    e.preventDefault();

    // Construct the data object to send to the backend
    const mentorNote = {
      mentee: mentee,
      date: date,
      skippedMeeting: skippedMeeting,
      finishedHW: finishedHW,
      attitude: attitude,
      comments: comments,
    };

    console.log("Mentor Note:", JSON.stringify(mentorNote));

    setNote([...note, mentorNote]);
    // Clear input fields after creation
    setMentee("");
    setComments("");
    setDate("");
    setSkippedMeeting("");
    setFinishedHW("");
    setAttitude("");
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
          value={mentee}
          onChange={(e) => setMentee(e.target.value)}
          placeholder="Enter mentee name"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
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
              value="1"
              checked={skippedMeeting === "1"}
              onChange={(e) => setSkippedMeeting(e.target.value)}
            />
            <label htmlFor="skippedMeetingYes">Yes</label>

            <input
              type="radio"
              name="skippedMeeting"
              value="0"
              checked={skippedMeeting === "0"}
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
              value="1"
              checked={finishedHW === "1"}
              onChange={(e) => setFinishedHW(e.target.value)}
            />
            <label htmlFor="finishedHWYes">Yes</label>

            <input
              type="radio"
              name="finishedHW"
              value="0"
              checked={finishedHW === "0"}
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
              value="3"
              checked={attitude === "3"}
              onChange={(e) => setAttitude(e.target.value)}
            />

            <label htmlFor="attitude-very-good">Very Good</label>

            <input
              type="radio"
              id="attitude-average"
              name="attitude"
              value="2"
              checked={attitude === "2"}
              onChange={(e) => setAttitude(e.target.value)}
            />
            <label htmlFor="attitude-average">Average</label>
            <input
              type="radio"
              id="attitude-not-good"
              name="attitude"
              value="1"
              checked={attitude === "1"}
              onChange={(e) => setAttitude(e.target.value)}
            />
            <label htmlFor="attitude-not-good">Not Good</label>
          </div>
        </div>
        <div class="comment-container">
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Extra comments here"
          />
          <button className="submit-button" onClick={handleInsertMentorNotes}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default WriteMenteeProgression;
