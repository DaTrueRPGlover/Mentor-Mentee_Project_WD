import React, { useState } from 'react';
import './TodoProgression.css';

function TodoProgression() {
  const [tasks, setTasks] = useState([
    { task: 'Complete assignment 1', status: 'Pending' },
    { task: 'Review feedback from mentor', status: 'In Progress' },
  ]);

  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { task: newTask, status: 'Pending' }]);
      setNewTask(''); // Clear input after adding
    }
  };

  const handleStatusUpdate = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, status: 'Completed' } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="todo-progression">
      <h1>To-Do / Progression</h1>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task.task} - <strong>{task.status}</strong>
            {task.status !== 'Completed' && (
              <button onClick={() => handleStatusUpdate(index)}>Mark as Completed</button>
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
