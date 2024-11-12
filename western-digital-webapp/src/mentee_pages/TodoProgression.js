import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import "./TodoProgression.css";
import logo from "../assets/WDC.png"; // <-- Import the logo
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import MoodIcon from '@mui/icons-material/Mood';


function TodoProgression() {
  const navigate = useNavigate(); // <-- Initialize navigate

  const [tasks, setTasks] = useState([
    { task: "Complete assignment 1", status: "Pending" },
    { task: "Review feedback from mentor", status: "In Progress" },
  ]);

  const [progressReports, setProgressReports] = useState([
  ]);

  const [newReport, setNewReport] = useState("");
  const [newTask, setNewTask] = useState("");
  const [communication, setCommunication] = useState(""); 
  const [influence, setInfluence] = useState(""); 
  const [managingProjects, setManagingProjects] = useState(""); 
  const [innovation, setInnovation] = useState(""); 
  const [emotionalIntelligence, setEmotionalIntelligence] = useState("");
  const [decisionMaking, setDecisionMaking] = useState(""); 
 




  const handleAddReport = () => {
    
    const newReportData = {
      notes: newReport,
      communication, 
      influence, 
      managingProjects, 
      innovation,
      emotionalIntelligence,
      decisionMaking,
    };

    console.log("New Report Submitted:", newReportData);

    setProgressReports([...progressReports, newReportData]);
    setNewReport(""); 
    setCommunication(null); 
    setInfluence(null); 
    setManagingProjects(null); 
    setInnovation(null);
    setEmotionalIntelligence(null);
    setDecisionMaking(null);

  };


  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { task: newTask, status: "Pending" }]);
      setNewTask(""); // Clear input after adding
    }
  };

  const handleStatusUpdate = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, status: "Completed" } : task
    );
    setTasks(updatedTasks);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>

        </div>
        <div className="welcome-message-container">
        <h1 className="welcome-message">To-Do / Progression</h1>
        </div>
      </header>


      <div className="content-split">

        {/* Form Section */}
        <div className="form-section">

          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <EventBusyOutlinedIcon className="form-title-icon" />
                <p>Communication</p>
              </div>

              <input
                type="radio"
                id="communication-very-helpful"
                name="communication"
                value="Very Helpful"
                checked={communication === "Very Helpful"}
                onChange={(e) => setCommunication(e.target.value)}
              />

              <label htmlFor="communication-very-helpful">Very Helpful</label>

              <input
                type="radio"
                id="communication-somewhat-helpful"
                name="communication"
                value="Somewhat Helpful"
                checked={communication === "Somewhat Helpful"}
                onChange={(e) => setCommunication(e.target.value)}
              />
              <label htmlFor="communication-somewhat-helpful">Somewhat Helpful</label>
              <input
                type="radio"
                id="communication-not-good"
                name="communication"
                value="Not Good"
                checked={communication === "Not Good"}
                onChange={(e) => setCommunication(e.target.value)}
              />
              <label htmlFor="communication-not-good">Not Helpful</label>

            </div>
          </div>

          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
                <p>Influence</p>
              </div>
             
              <input
                type="radio"
                id="influence-very-helpful"
                name="influence"
                value="Very Helpful"
                checked={influence === "Very Helpful"}
                onChange={(e) => setInfluence(e.target.value)}
              />

              <label htmlFor="influence-very-helpful">Very Helpful</label>

              <input
                type="radio"
                id="influence-somewhat-helpful"
                name="influence"
                value="Somewhat Helpful"
                checked={influence === "Somewhat Helpful"}
                onChange={(e) => setInfluence(e.target.value)}
              />
              <label htmlFor="influence-somewhat-helpful">Somewhat Helpful</label>
              <input
                type="radio"
                id="influence-not-good"
                name="influence"
                value="Not Good"
                checked={influence === "Not Good"}
                onChange={(e) => setInfluence(e.target.value)}
              />
              <label htmlFor="influence-not-good">Not Helpful</label>

            </div>
          </div>

          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <MoodIcon className="form-title-icon" />
                <p>Managing Projects</p>
              </div>
              <input
                type="radio"
                id="managingProjects-very-helpful"
                name="managingProjects"
                value="Very Helpful"
                checked={managingProjects === "Very Helpful"}
                onChange={(e) => setManagingProjects(e.target.value)}
              />

              <label htmlFor="managingProjects-very-helpful">Very Helpful</label>

              <input
                type="radio"
                id="managingProjects-somewhat-helpful"
                name="managingProjects"
                value="Somewhat Helpful"
                checked={managingProjects === "Somewhat Helpful"}
                onChange={(e) => setManagingProjects(e.target.value)}
              />
              <label htmlFor="managingProjects-somewhat-helpful">Somewhat Helpful</label>
              <input
                type="radio"
                id="managingProjects-not-good"
                name="managingProjects"
                value="Not Good"
                checked={managingProjects === "Not Good"}
                onChange={(e) => setManagingProjects(e.target.value)}
              />
              <label htmlFor="managingProjects-not-good">Not Helpful</label>
            </div>
          </div>

          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
                <p>Innovation</p>
              </div>
             
              <input
                type="radio"
                id="innovation-very-helpful"
                name="innovation"
                value="Very Helpful"
                checked={innovation === "Very Helpful"}
                onChange={(e) => setInnovation(e.target.value)}
              />

              <label htmlFor="innovation-very-helpful">Very Helpful</label>

              <input
                type="radio"
                id="innovation-somewhat-helpful"
                name="innovation"
                value="Somewhat Helpful"
                checked={innovation === "Somewhat Helpful"}
                onChange={(e) => setInnovation(e.target.value)}
              />
              <label htmlFor="innovation-somewhat-helpful">Somewhat Helpful</label>
              <input
                type="radio"
                id="innovation-not-good"
                name="innovation"
                value="Not Good"
                checked={innovation === "Not Good"}
                onChange={(e) => setInnovation(e.target.value)}
              />
              <label htmlFor="innovation-not-good">Not Helpful</label>

            </div>
          </div>

          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
                <p>Emotional Intelligence</p>
              </div>
             
              <input
                type="radio"
                id="emotionalIntelligence-very-helpful"
                name="emotionalIntelligence"
                value="Very Helpful"
                checked={emotionalIntelligence === "Very Helpful"}
                onChange={(e) => setEmotionalIntelligence(e.target.value)}
              />

              <label htmlFor="emotionalIntelligence-very-helpful">Very Helpful</label>

              <input
                type="radio"
                id="emotionalIntelligence-somewhat-helpful"
                name="emotionalIntelligence"
                value="Somewhat Helpful"
                checked={emotionalIntelligence === "Somewhat Helpful"}
                onChange={(e) => setEmotionalIntelligence(e.target.value)}
              />
              <label htmlFor="emotionalIntelligence-somewhat-helpful">Somewhat Helpful</label>
              <input
                type="radio"
                id="emotionalIntelligence-not-good"
                name="emotionalIntelligence"
                value="Not Good"
                checked={emotionalIntelligence === "Not Good"}
                onChange={(e) => setEmotionalIntelligence(e.target.value)}
              />
              <label htmlFor="emotionalIntelligence-not-good">Not Helpful</label>

            </div>
          </div>

          <div className="form-box">
            <div className="question-group">
              <div className="form-title">
                <AssignmentTurnedInOutlinedIcon className="form-title-icon" />
                <p>Decision Making</p>
              </div>
             
              <input
                type="radio"
                id="decisionMaking-very-helpful"
                name="decisionMaking"
                value="Very Helpful"
                checked={decisionMaking === "Very Helpful"}
                onChange={(e) => setDecisionMaking(e.target.value)}
              />

              <label htmlFor="decisionMaking-very-helpful">Very Helpful</label>

              <input
                type="radio"
                id="decisionMaking-somewhat-helpful"
                name="decisionMaking"
                value="Somewhat Helpful"
                checked={decisionMaking === "Somewhat Helpful"}
                onChange={(e) => setDecisionMaking(e.target.value)}
              />
              <label htmlFor="decisionMaking-somewhat-helpful">Somewhat Helpful</label>
              <input
                type="radio"
                id="decisionMaking-not-good"
                name="decisionMaking"
                value="Not Good"
                checked={decisionMaking === "Not Good"}
                onChange={(e) => setDecisionMaking(e.target.value)}
              />
              <label htmlFor="decisionMaking-not-good">Not Helpful</label>

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

        {/* Tasks Section */}
        <div className="tasks-section">
       
        <div className="form-box">

        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              {task.task} - <strong>{task.status}</strong>
              {task.status !== "Completed" && (
                <button onClick={() => handleStatusUpdate(index)}>
                  Mark as Completed
                </button>
              )}
            </li>
          ))}
        </ul>
        </div>
        <div className="form-box">

        <div className="add-task">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task"
          />
          <button onClick={handleAddTask}>Add Task</button>
        </div>
        </div>
        
        </div>
      </div>
    </div>
  );
}

export default TodoProgression;
