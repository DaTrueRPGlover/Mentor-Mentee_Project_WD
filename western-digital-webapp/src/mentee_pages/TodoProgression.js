import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import "./TodoProgression.css";
import logo from "../assets/WDC.png"; // <-- Import the logo

function TodoProgression() {
  const navigate = useNavigate(); // <-- Initialize navigate

  const [tasks, setTasks] = useState([
    { task: "Complete assignment 1", status: "Pending" },
    { task: "Review feedback from mentor", status: "In Progress" },
  ]);

  const [newTask, setNewTask] = useState("");

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
        <h1 className="welcome-message">To-Do / Progression</h1>
      </header>

      

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
  );
}

export default TodoProgression;
