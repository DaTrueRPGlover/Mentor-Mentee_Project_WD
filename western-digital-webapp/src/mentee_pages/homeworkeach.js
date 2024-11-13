import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Linkify from 'react-linkify';
import './homeworkeach.css';

const HomeworkEach = () => {
  const { homeworkId } = useParams();
  const [homework, setHomework] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeworkEach = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/homework/${homeworkId}`);
        const data = await response.json();
        setHomework(data);
      } catch (error) {
        setError('Failed to fetch homework details. Please try again later.');
        console.error('Error fetching homework details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworkEach();
  }, [homeworkId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="homework-detail">
      <div className="white">
        <h1>{homework.title}</h1>
        {/* Wrap description in Linkify to auto-detect links */}
        <Linkify>
          <p className="homework-description">{homework.description}</p>
        </Linkify>
        <p className="homework-date">
          Assigned: {format(new Date(homework.assigned_date), 'MMMM dd, yyyy')}
        </p>
        <p className="homework-date">
          Due: {format(new Date(homework.due_date), 'MMMM dd, yyyy')}
        </p>
      </div>

    </div>
  );
};

export default HomeworkEach;
