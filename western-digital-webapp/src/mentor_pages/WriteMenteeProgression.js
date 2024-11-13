import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WriteMenteeProgression.css";
import logo from "../assets/WDC.png";
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import MoodIcon from '@mui/icons-material/Mood';

function WriteMenteeProgression() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);  // Initialize as an array
  const [selectedMeeting, setSelectedMeeting] = useState("");
  const [selectedMentee, setSelectedMentee] = useState("");
  const [skipped, setSkipped] = useState(null);
  const [finished_homework, setFinishedHomework] = useState(null);
  const [attitude_towards_learning, setAttitudeTowardsLearning] = useState(null);
  const [newReport, setNewReport] = useState("");
  const [mentees, setMentees] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const mentorKey = userInfo?.mentorkey;

    if (mentorKey) {
      fetch(`http://localhost:3001/api/relationships/mentees?mentorkey=${mentorKey}`)
        .then((response) => response.json())
        .then((data) => setMentees(data || []))  // Ensure mentees is always an array
        .catch((error) => console.error("Error fetching mentees:", error));
    }
  }, []);

  useEffect(() => {
    if (selectedMentee) {
      const userInfo = JSON.parse(localStorage.getItem("user"));
      const mentorKey = userInfo?.mentorkey;

      fetch(`http://localhost:3001/api/mentornotes/meetings/${mentorKey}/${selectedMentee}`)
        .then((response) => response.json())
        .then((data) => setMeetings(Array.isArray(data) ? data : []))  // Ensure meetings is an array
        .catch((error) => console.error("Error fetching meetings:", error));
    } else {
      setMeetings([]); // Clear meetings if no mentee is selected
    }
  }, [selectedMentee]);

  const handleAddReport = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const mentorkey = userInfo?.mentorkey;
  
    if (!mentorkey) {
      console.error("mentorkey is missing. Please log in again.");
      return;
    }
  
    const newReportData = {
      meetingkey: selectedMeeting,
      mentorkey: mentorkey,
      skipped: skipped === "yes" ? 2 : 1,
      finished_homework: finished_homework === "yes" ? 2 : 1,
      attitude_towards_learning: 
        attitude_towards_learning === "very_good" ? 3 : attitude_towards_learning === "good" ? 2 : 1,
      additional_comments: newReport, 
    };
  
    try {
      const response = await fetch("http://localhost:3001/api/mentornotes/mentornotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReportData),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Report added:", result);
        setNewReport("");
        setSelectedMeeting("");
        setSkipped(null);
        setFinishedHomework(null);
        setAttitudeTowardsLearning(null);
      } else {
        console.error("Error pushing new report");
      }
    } catch (error) {
      console.error("Error pushing new report:", error);
    }
  };

  return (
    <div className="todo-progression">
      <header className="header-container">
        <div className="top-header">
          <button
            className="logo-button"
            onClick={() => navigate("/mentor-home")}
          >
            <img src={logo} alt="Logo" className="logo" />
          </button>
          <button
            className="logout-button"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
        <div className="welcome-message-container">
          <h1 className="welcome-message">Mentee Survey</h1>
        </div>
      </header>

      <div className="content-split">
        <div className="form-section">
          <h1>Select Mentees and Meeting</h1>

          {/* Mentee Dropdown */}
          <div>
            <label>Select a Mentee:</label>
            <select
              value={selectedMentee}
              onChange={(e) => setSelectedMentee(e.target.value)}
            >
              <option value="" disabled>Select a mentee</option>
              {mentees.map((mentee) => (
                <option key={mentee.menteekey} value={mentee.menteekey}>
                  {mentee.menteeName}
                </option>
              ))}
            </select>
          </div>

          {/* Meetings Dropdown */}
          <div className="form-box">
            <label htmlFor="meetingSelect">Select Meeting:</label>
            <select
              id="meetingSelect"
              value={selectedMeeting}
              onChange={(e) => setSelectedMeeting(e.target.value)}
              disabled={!selectedMentee}
            >
              <option value="">Choose a meeting</option>
              {meetings.map((meeting) => (
                <option key={meeting.meetingkey} value={meeting.meetingkey}>
                  {new Date(meeting.datetime).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Skipped Section */}
          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <EventBusyOutlinedIcon className="form-title-icon" />
                <p>Skipped</p>
              </div>
              <input
                type="radio"
                id="skipped-yes"
                name="skipped"
                value="yes"
                checked={skipped === "yes"}
                onChange={(e) => setSkipped(e.target.value)}
              />
              <label htmlFor="skipped-yes">Yes</label>

              <input
                type="radio"
                id="skipped-no"
                name="skipped"
                value="no"
                checked={skipped === "no"}
                onChange={(e) => setSkipped(e.target.value)}
              />
              <label htmlFor="skipped-no">No</label>
            </div>
          </div>

          {/* Finished Homework Section */}
          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
                <p>Finished Homework</p>
              </div>
              <input
                type="radio"
                id="finished_homework-yes"
                name="finished_homework"
                value="yes"
                checked={finished_homework === "yes"}
                onChange={(e) => setFinishedHomework(e.target.value)}
              />
              <label htmlFor="finished_homework-yes">Yes</label>

              <input
                type="radio"
                id="finished_homework-no"
                name="finished_homework"
                value="no"
                checked={finished_homework === "no"}
                onChange={(e) => setFinishedHomework(e.target.value)}
              />
              <label htmlFor="finished_homework-no">No</label>
            </div>
          </div>

          {/* Attitude Towards Learning Section */}
          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <MoodIcon className="form-title-icon" />
                <p>Attitude Towards Learning</p>
              </div>
              <input
                type="radio"
                id="attitude_towards_learning-very_good"
                name="attitude_towards_learning"
                value="very_good"
                checked={attitude_towards_learning === "very_good"}
                onChange={(e) => setAttitudeTowardsLearning(e.target.value)}
              />
              <label htmlFor="attitude_towards_learning-very_good">Very Good</label>

              <input
                type="radio"
                id="attitude_towards_learning-good"
                name="attitude_towards_learning"
                value="good"
                checked={attitude_towards_learning === "good"}
                onChange={(e) => setAttitudeTowardsLearning(e.target.value)}
              />
              <label htmlFor="attitude_towards_learning-good">Good</label>

              <input
                type="radio"
                id="attitude_towards_learning-bad"
                name="attitude_towards_learning"
                value="bad"
                checked={attitude_towards_learning === "bad"}
                onChange={(e) => setAttitudeTowardsLearning(e.target.value)}
              />
              <label htmlFor="attitude_towards_learning-bad">Bad</label>
            </div>
          </div>

          <div className="comment-container">
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
    </div>
  );
}

export default WriteMenteeProgression;
