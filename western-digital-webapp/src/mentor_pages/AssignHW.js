// src/components/AssignHW.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './AssignHW.css'; // Create this CSS file for styling
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";

function AssignHW() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedDate, setAssignedDate] = useState('');
  const [assignedTime, setAssignedTime] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [selectedMentees, setSelectedMentees] = useState([]);
  const [mentees, setMentees] = useState([]);
  const userInfo = JSON.parse(sessionStorage.getItem('user'));
  const mentorKey = userInfo?.mentorkey || '';
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/relationships/mentees?mentorkey=${mentorKey}`);
        if (response.ok) {
          const menteesData = await response.json();
          setMentees(menteesData);
        } else {
          throw new Error('Failed to fetch mentees');
        }
      } catch (error) {
        console.error('Error fetching mentees:', error);
      }
    };
    if (mentorKey) {
      fetchMentees();
    }

    // Set default assigned date and time
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const currentTime = now.toTimeString().split(':').slice(0, 2).join(':'); // Format: HH:MM
    setAssignedDate(currentDate);
    setAssignedTime(currentTime);
  }, [mentorKey]);

  const handleAssignHomework = async () => {
    if (!title || !description || !assignedDate || !assignedTime || !dueDate || !dueTime || selectedMentees.length === 0) {
      alert("Please fill out all fields and select at least one mentee.");
      return;
    }

    const homeworkData = {
      title,
      description,
      assignedDateTime: `${assignedDate} ${assignedTime}`,
      dueDateTime: `${dueDate} ${dueTime}`,
      mentees: selectedMentees,
      mentorKey,
    };

    console.log("Homework Data to Send:", homeworkData); // Debugging log

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/homework/assign-homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homeworkData),
      });
      if (response.ok) {
        alert('Homework assigned successfully!');
        // Reset form
        setTitle('');
        setDescription('');
        setAssignedDate('');
        setAssignedTime('');
        setDueDate('');
        setDueTime('');
        setSelectedMentees([]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign homework');
      }
    } catch (error) {
      console.error('Error assigning homework:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMenteeSelection = (menteeId) => {
    setSelectedMentees((prevSelected) =>
      prevSelected.includes(menteeId) ? prevSelected.filter((id) => id !== menteeId) : [...prevSelected, menteeId]
    );
  };

  return (
    <div className="assign-hw-container">
      <Typography variant="h5" gutterBottom>
        Assign Homework
      </Typography>
      <form className="assign-hw-form" noValidate autoComplete="off">
        <TextField
          label="Homework Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Homework Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
        />
        <div className="date-time-section">
          <Typography variant="subtitle1">Assigned Date and Time</Typography>
          <TextField
            type="date"
            label="Assigned Date"
            value={assignedDate}
            onChange={(e) => setAssignedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            type="time"
            label="Assigned Time"
            value={assignedTime}
            onChange={(e) => setAssignedTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </div>
        <div className="date-time-section">
          <Typography variant="subtitle1">Due Date and Time</Typography>
          <TextField
            type="date"
            label="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            type="time"
            label="Due Time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </div>
        <div className="mentees-section">
          <Typography variant="subtitle1">Select Mentees</Typography>
          <FormGroup>
            {mentees.map((mentee) => (
              <FormControlLabel
                key={mentee.menteekey}
                control={
                  <Checkbox
                    checked={selectedMentees.includes(mentee.menteekey)}
                    onChange={() => handleMenteeSelection(mentee.menteekey)}
                    name={mentee.menteeName}
                  />
                }
                label={mentee.menteeName}
              />
            ))}
          </FormGroup>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAssignHomework}
          disabled={
            !title ||
            !description ||
            !assignedDate ||
            !assignedTime ||
            !dueDate ||
            !dueTime ||
            selectedMentees.length === 0 ||
            isSubmitting
          }
        >
          {isSubmitting ? 'Assigning...' : 'Assign Homework'}
        </Button>
      </form>
    </div>
  );
}

export default AssignHW;
