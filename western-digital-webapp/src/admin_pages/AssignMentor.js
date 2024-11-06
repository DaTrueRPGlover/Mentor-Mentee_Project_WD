import React, { useState, useEffect } from 'react';
import './AssignMentor.css';
import { useNavigate } from "react-router-dom"; 
import logo from '../assets/WDC.png';

function AssignMentor() {
  const navigate = useNavigate(); // Initialize navigate

  const [mentees, setMentees] = useState([]);
  const [newMentee, setNewMentee] = useState('');
  const [newMentor, setNewMentor] = useState('');
  
  // State to hold fetched mentor and mentee names
  const [mentors, setMentors] = useState([]);
  const [menteesList, setMenteesList] = useState([]);

  // Loading state to handle loading indicators
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch mentor names
    const fetchMentorNames = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/mentors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Mentor Names:', data);
          setMentors(data); // Store fetched mentor names in state
        } else {
          console.error('Failed to fetch mentor names:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching mentor names:', error);
      }
    };

    // Fetch mentee names
    const fetchMenteeNames = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/mentees', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Mentee Names:', data);
          setMenteesList(data); // Store fetched mentee names in state
        } else {
          console.error('Failed to fetch mentee names:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching mentee names:', error);
      }
    };

    // Fetch both mentor and mentee names
    const fetchData = async () => {
      await fetchMentorNames();
      await fetchMenteeNames();
      setLoading(false); // Set loading to false once data is fetched
    };

    fetchData(); // Fetch mentor and mentee names when component mounts
  }, []);

  // Handle assigning mentor to mentee
  const handleAssignMentor = async () => {
    if (newMentee.trim() && newMentor.trim()) {
      const newAssignment = { mentee: newMentee, mentor: newMentor };
      
      // Update local state to reflect new assignment
      setMentees((prevMentees) => [...prevMentees, newAssignment]);

      // Send the assignment to the backend
      try {
        const response = await fetch('http://localhost:3001/api/assign-mentor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAssignment),
        });

        if (response.ok) {
          console.log('Mentor assigned successfully');
          setNewMentee('');
          setNewMentor('');
        } else {
          console.error('Failed to assign mentor:', response.statusText);
        }
      } catch (error) {
        console.error('Error assigning mentor:', error);
      }
    } else {
      console.error('Please select both a mentor and a mentee.');
    }
  };

  // Handle updating mentor for an existing mentee
  const handleUpdateMentor = (index) => {
    const updatedMentees = mentees.map((mentee, i) =>
      i === index ? { ...mentee, mentor: newMentor } : mentee
    );
    setMentees(updatedMentees);
  };

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="assign-mentor-container">
      <header className="header-container">
        <div className="top-header">
          <img src={logo} alt="Logo" className="logo" />
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h1 className="welcome-message">Assign Mentor To Mentee</h1>
      </header>

      <div className="content-container">
        <div className="rectangle">
          {/* Display the fetched mentor and mentee names */}
          <ul>
            {loading ? (
              <li>Loading...</li>
            ) : (
              <>
                <h3>Mentors:</h3>
                {mentors.length > 0 ? (
                  mentors.map((mentor, index) => (
                    <li key={index}>
                      <strong>{mentor.name} {mentor.lastname} (Mentor)</strong>
                    </li>
                  ))
                ) : (
                  <li>No mentors found.</li>
                )}
                <h3>Mentees:</h3>
                {menteesList.length > 0 ? (
                  menteesList.map((mentee, index) => (
                    <li key={index}>
                      <span>{mentee.name} {mentee.lastname} (Mentee)</span>
                    </li>
                  ))
                ) : (
                  <li>No mentees found.</li>
                )}
              </>
            )}
          </ul>
        </div>

        <div className="assign-form">
          <ul>
            {mentees.map((mentee, index) => (
              <li key={index} className="mentee-list-item">
                {mentee.mentee} is mentored by <strong>{mentee.mentor}</strong>
                <input
                  type="text"
                  placeholder="Update mentor"
                  onChange={(e) => setNewMentor(e.target.value)}
                />
                <button onClick={() => handleUpdateMentor(index)}>Update Mentor</button>
              </li>
            ))}
          </ul>

          <div className="add-assignment">
            <input
              type="text"
              value={newMentee}
              onChange={(e) => setNewMentee(e.target.value)}
              placeholder="Enter mentee name"
            />
            <input
              type="text"
              value={newMentor}
              onChange={(e) => setNewMentor(e.target.value)}
              placeholder="Enter mentor name"
            />
            <button onClick={handleAssignMentor}>Assign Mentor</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignMentor;
