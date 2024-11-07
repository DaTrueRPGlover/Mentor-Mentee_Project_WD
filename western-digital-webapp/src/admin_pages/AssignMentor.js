// AssignMentor.js

import React, { useState, useEffect } from 'react';
import './AssignMentor.css';
import { useNavigate } from "react-router-dom"; 
import logo from '../assets/WDC.png';

function AssignMentor() {
  const navigate = useNavigate();

  const [newMentee, setNewMentee] = useState(null);
  const [newMentor, setNewMentor] = useState(null);

  const [mentors, setMentors] = useState([]);
  const [menteesList, setMenteesList] = useState([]);
  const [relationships, setRelationships] = useState([]);

  const [loading, setLoading] = useState(true);

  // State for error messages
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
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
          setMentors(data);
        } else {
          console.error('Failed to fetch mentor names:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching mentor names:', error);
      }
    };

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
          setMenteesList(data);
        } else {
          console.error('Failed to fetch mentee names:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching mentee names:', error);
      }
    };

    const fetchRelationships = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/relationships', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRelationships(data);
        } else {
          console.error('Failed to fetch relationships:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching relationships:', error);
      }
    };

    const fetchData = async () => {
      await fetchMentorNames();
      await fetchMenteeNames();
      await fetchRelationships();
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAssignMentor = async () => {
    if (newMentee && newMentor) {
      const newAssignment = {
        menteekey: newMentee.userid,
        mentorkey: newMentor.userid,
      };

      try {
        const response = await fetch('http://localhost:3001/api/relationships/assign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAssignment),
        });

        if (response.ok) {
          console.log('Mentor assigned successfully');
          await fetchRelationships();
          setNewMentee(null);
          setNewMentor(null);
          setErrorMessage(''); // Clear any previous error messages
        } else {
          const errorData = await response.json();
          console.error('Failed to assign mentor:', errorData.error);
          setErrorMessage(errorData.error); // Set the error message to display
        }
      } catch (error) {
        console.error('Error assigning mentor:', error);
        setErrorMessage('An unexpected error occurred.');
      }
    } else {
      console.error('Please select both a mentor and a mentee.');
      setErrorMessage('Please select both a mentor and a mentee.');
    }
  };

  const handleUpdateMentor = async (menteekey, newMentorkey) => {
    try {
      const response = await fetch('http://localhost:3001/api/relationships/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menteekey, mentorkey: newMentorkey }),
      });

      if (response.ok) {
        console.log('Mentor updated successfully');
        await fetchRelationships();
        setErrorMessage(''); // Clear any previous error messages
      } else {
        const errorData = await response.json();
        console.error('Failed to update mentor:', errorData.error);
        setErrorMessage(errorData.error); // Set the error message to display
      }
    } catch (error) {
      console.error('Error updating mentor:', error);
      setErrorMessage('An unexpected error occurred.');
    }
  };

  const fetchRelationships = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/relationships', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRelationships(data);
      } else {
        console.error('Failed to fetch relationships:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching relationships:', error);
    }
  };

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
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h3>Mentors:</h3>
              {mentors.length > 0 ? (
                mentors.map((mentor) => (
                  <p key={mentor.userid}>
                    {mentor.name} {mentor.lastname}
                  </p>
                ))
              ) : (
                <p>No mentors found.</p>
              )}
              <h3>Mentees:</h3>
              {menteesList.length > 0 ? (
                menteesList.map((mentee) => (
                  <p key={mentee.userid}>
                    {mentee.name} {mentee.lastname}
                  </p>
                ))
              ) : (
                <p>No mentees found.</p>
              )}
            </>
          )}
        </div>

        <div className="assign-form">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <h3>Existing Assignments:</h3>
          <ul>
            {relationships.map((rel) => (
              <li key={rel.relationship_id} className="mentee-list-item">
                {rel.mentee_name} {rel.mentee_lastname} is mentored by <strong>{rel.mentor_name} {rel.mentor_lastname}</strong>
                <select
                  onChange={(e) => {
                    const newMentorkey = e.target.value;
                    if (newMentorkey) {
                      handleUpdateMentor(rel.menteekey, newMentorkey);
                    }
                  }}
                >
                  <option value="">Change Mentor</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.userid} value={mentor.userid}>
                      {mentor.name} {mentor.lastname}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>

          <div className="add-assignment">
            <h3>Assign a Mentor to a Mentee:</h3>
            <select
              value={newMentee ? newMentee.userid : ''}
              onChange={(e) => {
                const mentee = menteesList.find(m => m.userid === e.target.value);
                setNewMentee(mentee);
              }}
            >
              <option value="">Select Mentee</option>
              {menteesList.map((mentee) => (
                <option key={mentee.userid} value={mentee.userid}>
                  {mentee.name} {mentee.lastname}
                </option>
              ))}
            </select>
            <select
              value={newMentor ? newMentor.userid : ''}
              onChange={(e) => {
                const mentor = mentors.find(m => m.userid === e.target.value);
                setNewMentor(mentor);
              }}
            >
              <option value="">Select Mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor.userid} value={mentor.userid}>
                  {mentor.name} {mentor.lastname}
                </option>
              ))}
            </select>
            <button onClick={handleAssignMentor}>Assign Mentor</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignMentor;
