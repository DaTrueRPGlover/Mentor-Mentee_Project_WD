// todoprogression.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WriteMenteeProgression.css";
import logo from "../assets/WDC.png";
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import MoodIcon from '@mui/icons-material/Mood';

function WriteMenteeProgression() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState("");
  
  const [skipped, setskipped] = useState(null);
  const [finished_homework, setfinished_homework] = useState(null);
  const [attitude_towards_learning, setattitude_towards_learning] = useState(null);
  const [error, setError] = useState(null);
  const [newReport, setNewReport] = useState("");
  const [newMessage, setNewMessage] = useState('');
  const [mentees, setMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState('');
  const [menteesList, setMenteesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [meetingsList, setMeetingsList] = useState([]);

  useEffect(() => {
    // Retrieve the mentorKey from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const mentorKey = userInfo?.mentorkey;

    if (mentorKey) {
      fetch(`http://localhost:3001/api/mentornotes/meetings/${mentorKey}`)
        .then(response => response.json())
        .then(data => setMeetings(data))
        .catch(error => console.error("Error fetching meetings:", error));
    } else {
      console.error("mentorKey not found in local storage.");
      setError("mentorKey not found.");
    }
  }, []);

  const ratingToScore = (rating) => {
    switch (rating) {
      case "Very Helpful": return 3;
      case "Somewhat Helpful": return 2;
      case "Not Helpful": return 1;
      default: return null;
    }
  };

  const handleAddReport = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const mentorKey = userInfo?.mentorKey;

    if (!mentorKey) {
      setError("mentorKey is missing. Please log in again.");
      return;
    }

    const newReportData = {
      meetingkey: selectedMeeting,
      mentorKey: mentorKey, // Add mentorKey to the data being sent
      notes: newReport,
      skipped: ratingToScore(skipped),
      finished_homework: ratingToScore(finished_homework),
      attitude_towards_learning: ratingToScore(attitude_towards_learning),
    };

    try {
      const response = await fetch('http://localhost:3001/api/mentornotes/mentornotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReportData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Report added:", result);
        setNewReport("");
        setSelectedMeeting("");
        setskipped(null);
        setfinished_homework(null);
        setattitude_towards_learning(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error pushing new report");
      }
    } catch (error) {
      console.error("Error pushing new report:", error);
      setError("Error pushing new report");
    }
  };
  const fetchMenteeNames = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/mentees');
      if (response.ok) {
        const data = await response.json();
        setMenteesList(data);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error fetching mentee data');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching mentee data');
    }
  };
  const fetchMeetingsByMentee = async (menteekey) => {
    try {
      const response = await fetch(`http://localhost:3001/api/meetings/mentees/${menteekey}`);
      if (response.ok) {
        const data = await response.json();
        setMeetingsList(data);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error fetching meetings data');
        setMeetingsList([]);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching meetings data');
      setMeetingsList([]);
    }
  };
  return (
    <div className="todo-progression">
      <header className="header-container">
        <div className="top-header">
          <button
            className="logo-button"
            onClick={() => navigate("/mentee-home")}
          >
            <img src={logo} alt="Logo" className="logo" />
          </button>
          <button className="logout-button" onClick={() => {
            localStorage.clear();
            navigate("/");
          }}>
            Logout
          </button>
        </div>
        <div className="welcome-message-container">
          <h1 className="welcome-message">To-Do / Progression</h1>
        </div>
      </header>

      <div className="content-split">
        <div className="form-section">
        <h1>Select Mentees</h1>
      {mentees.length > 0 ? (
        <div>
          <label>Select a Mentee:</label>
          <select
            value={selectedMentee}
            onChange={(e) => setSelectedMentee(e.target.value)}
          >
            <option value="" disabled>
              Select a mentee
            </option>
            {mentees.map((mentee) => (
              <option key={mentee.mentorKey} value={mentee.mentorKey}>
                {mentee.menteeName}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>You have no mentees assigned.</p>
      )}
          <div className="form-box">
            <label htmlFor="meetingSelect">Select Meeting:</label>
            <select
              id="meetingSelect"
              value={selectedMeeting}
              onChange={(e) => setSelectedMeeting(e.target.value)}
            >
              <option value="">Choose a meeting</option>
              {meetings.map((meeting) => (
                <option key={meeting.meetingkey} value={meeting.meetingkey}>
                  {new Date(meeting.datetime).toLocaleString()}
                </option>
              ))}
            </select>
            
          </div>

          {/* skipped Section */}
          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <EventBusyOutlinedIcon className="form-title-icon" />
                <p>skipped</p>
              </div>
              <input
                type="radio"
                id="skipped-very-helpful"
                name="skipped"
                value="Very Helpful"
                checked={skipped === "Very Helpful"}
                onChange={(e) => setskipped(e.target.value)}
              />
              <label htmlFor="skipped-very-helpful">Very Helpful</label>

              <input
                type="radio"
                id="skipped-somewhat-helpful"
                name="skipped"
                value="Somewhat Helpful"
                checked={skipped === "Somewhat Helpful"}
                onChange={(e) => setskipped(e.target.value)}
              />
              <label htmlFor="skipped-somewhat-helpful">Somewhat Helpful</label>

              <input
                type="radio"
                id="skipped-not-good"
                name="skipped"
                value="Not Helpful"
                checked={skipped === "Not Helpful"}
                onChange={(e) => setskipped(e.target.value)}
              />
              <label htmlFor="skipped-not-good">Not Helpful</label>
            </div>
          </div>

          {/* skipped Section */}
          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
                <p>finished_homework</p>
              </div>
              <input
                type="radio"
                id="finished_homework-very-helpful"
                name="finished_homework"
                value="Very Helpful"
                checked={finished_homework === "Very Helpful"}
                onChange={(e) => setfinished_homework(e.target.value)}
              />
              <label htmlFor="skipped-very-helpful">Very Helpful</label>

              <input
                type="radio"
                id="finished_homework-somewhat-helpful"
                name="finished_homework"
                value="Somewhat Helpful"
                checked={finished_homework === "Somewhat Helpful"}
                onChange={(e) => setfinished_homework(e.target.value)}
              />
              <label htmlFor="finished_homework-somewhat-helpful">Somewhat Helpful</label>

              <input
                type="radio"
                id="finished_homework-not-good"
                name="finished_homework"
                value="Not Helpful"
                checked={finished_homework === "Not Helpful"}
                onChange={(e) => setfinished_homework(e.target.value)}
              />
              <label htmlFor="finished_homework-not-good">Not Helpful</label>
            </div>
          </div>

          {/* Managing Projects Section */}
          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <MoodIcon className="form-title-icon" />
                <p>attitude_towards_learning</p>
              </div>
              <input
                type="radio"
                id="attitude_towards_learning-very-helpful"
                name="attitude_towards_learning"
                value="Very Helpful"
                checked={attitude_towards_learning === "Very Helpful"}
                onChange={(e) => setattitude_towards_learning(e.target.value)}
              />
              <label htmlFor="attitude_towards_learning-very-helpful">Very Helpful</label>

              <input
                type="radio"
                id="attitude_towards_learning-somewhat-helpful"
                name="attitude_towards_learning"
                value="Somewhat Helpful"
                checked={attitude_towards_learning === "Somewhat Helpful"}
                onChange={(e) => setattitude_towards_learning(e.target.value)}
              />
              <label htmlFor="attitude_towards_learning-somewhat-helpful">Somewhat Helpful</label>

              <input
                type="radio"
                id="attitude_towards_learning-not-good"
                name="attitude_towards_learning"
                value="Not Helpful"
                checked={attitude_towards_learning === "Not Helpful"}
                onChange={(e) => setattitude_towards_learning(e.target.value)}
              />
              <label htmlFor="attitude_towards_learning-not-good">Not Helpful</label>
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
