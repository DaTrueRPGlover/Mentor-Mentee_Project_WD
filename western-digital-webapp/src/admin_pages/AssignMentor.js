import React, { useState, useEffect } from "react";
import "./AssignMentor.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/WDC.png";

function AssignMentor() {
  const navigate = useNavigate();

  const [newMentee, setNewMentee] = useState(null);
  const [newMentor, setNewMentor] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [menteesList, setMenteesList] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMentorNames(),
          fetchMenteeNames(),
          fetchRelationships(),
        ]);
      } catch (error) {
        setErrorMessage("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchMentorNames = async () => {
    const response = await fetch("http://localhost:3001/api/mentors");
    if (response.ok) {
      const data = await response.json();
      setMentors(data);
    }
  };

  const fetchMenteeNames = async () => {
    const response = await fetch("http://localhost:3001/api/mentees");
    if (response.ok) {
      const data = await response.json();
      setMenteesList(data);
    }
  };

  const fetchRelationships = async () => {
    const response = await fetch("http://localhost:3001/api/relationships");
    if (response.ok) {
      const data = await response.json();
      setRelationships(data);
    }
  };

  const handleAssignMentor = async () => {
    if (newMentee && newMentor) {
      const newAssignment = {
        menteekey: newMentee.userid,
        mentorkey: newMentor.userid,
      };
      try {
        const response = await fetch(
          "http://localhost:3001/api/relationships/assign",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAssignment),
          }
        );
        if (response.ok) {
          await fetchRelationships();
          setNewMentee(null);
          setNewMentor(null);
          setErrorMessage("");
        } else {
          setErrorMessage("Failed to assign mentor");
        }
      } catch (error) {
        setErrorMessage("An unexpected error occurred");
      }
    } else {
      setErrorMessage("Please select both a mentor and a mentee.");
    }
  };

  const handleUpdateMentor = async (menteekey, newMentorkey) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/relationships/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ menteekey, mentorkey: newMentorkey }),
        }
      );
      if (response.ok) {
        await fetchRelationships();
      } else {
        setErrorMessage("Failed to update mentor");
      }
    } catch {
      setErrorMessage("An unexpected error occurred");
    }
  };

  const handleDeleteAssignment = async (relationship_id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/relationships/${relationship_id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        await fetchRelationships();
      } else {
        setErrorMessage("Failed to delete assignment");
      }
    } catch {
      setErrorMessage("An unexpected error occurred");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="assign-mentor">
      <header className="header-container">
        <div className="top-header">
          <button
            className="logo-button"
            onClick={() => navigate("/admin-home")}
          >
            <img src={logo} alt="Logo" className="logo" />
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="container">
          <h1 className="welcome-message">Assign Mentor To Mentee</h1>
        </div>
      </header>

      <div className="content-container">
        <div className="add-assignment">
          <h3>Assign a Mentor to a Mentee:</h3>
          <select
            value={newMentee ? newMentee.userid : ""}
            onChange={(e) => {
              const mentee = menteesList.find(
                (m) => m.userid === e.target.value
              );
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
            value={newMentor ? newMentor.userid : ""}
            onChange={(e) => {
              const mentor = mentors.find((m) => m.userid === e.target.value);
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

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <h3>Existing Assignments:</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="assignments-table">
            <thead>
              <tr>
                <th>Mentor</th>
                <th>Mentee</th>
                <th>Change Mentor</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {relationships.map((rel) => (
                <tr key={rel.relationship_id}>
                  <td>
                    {rel.mentor_name} {rel.mentor_lastname}
                  </td>
                  <td>
                    {rel.mentee_name} {rel.mentee_lastname}
                  </td>
                  <td>
                    <select
                      onChange={(e) => {
                        const newMentorkey = e.target.value;
                        if (newMentorkey)
                          handleUpdateMentor(rel.menteekey, newMentorkey);
                      }}
                    >
                      <option value="">Select Mentor</option>
                      {mentors.map((mentor) => (
                        <option key={mentor.userid} value={mentor.userid}>
                          {mentor.name} {mentor.lastname}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        handleDeleteAssignment(rel.relationship_id)
                      }
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AssignMentor;
