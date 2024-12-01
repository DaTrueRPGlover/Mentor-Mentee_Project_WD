// CheckHW.js
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import './checkHW.css';

const CheckHW = () => {
  const [homeworkData, setHomeworkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = JSON.parse(sessionStorage.getItem('user'));
  const menteeKey = userInfo?.menteekey;

  useEffect(() => {
    const fetchHomework = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/api/homework/mentee/${menteeKey}`);
        const data = await response.json();
        setHomeworkData(data || []);
      } catch (error) {
        setError('Failed to fetch homework. Please try again later.');
        console.error('Error fetching homework:', error);
      } finally {
        setLoading(false);
      }
    };

    if (menteeKey) {
      fetchHomework();
    } else {
      setError('Mentee key not found.');
    }
  }, [menteeKey]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="homework-page">
      <div className="whiteR">
          <h1>Assigned Homework</h1>
          {homeworkData.length === 0 ? (
            <p className="no-homework">No homework assignments found.</p>
          ) : (
            <div className="homework-list">
              {homeworkData.map((hw) => (
                <Link to={`/homework/${hw.homework_id}`} key={hw.homework_id} className="homework-card">
                  <h2 className="homework-title">{hw.title}</h2>
                  <p className="homework-description">{hw.description}</p>
                  <p className="homework-date">
                    Assigned: {format(new Date(hw.assigned_date), 'MMMM dd, yyyy')}
                  </p>
                  <p className="homework-date">
                    Due: {format(new Date(hw.due_date), 'MMMM dd, yyyy')}
                  </p>
                </Link>
              ))}
            </div>
          )}
      </div>

    </div>
  );
};

export default CheckHW;
