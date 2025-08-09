// src/components/CheckHWTable.js
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import './CheckHWTable.css';

const mockHomework = [
  {
    id: 'hw1',
    type: 'Homework',
    title: 'Math Worksheet',
    description: 'Complete exercises 1–20 on page 42.',
    date: new Date(2025, 7, 12, 23, 59),
    link: '/homework/1'
  },
  {
    id: 'hw2',
    type: 'Homework',
    title: 'Science Lab Report',
    description: 'Write up your findings on chemical reactions.',
    date: new Date(2025, 7, 15, 17, 0),
    link: '/homework/2'
  }
];

const mockMeetings = [
  {
    id: 'mt1',
    type: 'Meeting',
    title: 'Meeting with Dr. Smith',
    description: 'Zoom Password: 1234',
    date: new Date(2025, 7, 10, 10, 0),
    link: '/mentee-meetings'
  },
  {
    id: 'mt2',
    type: 'Meeting',
    title: 'Session with Prof. Lee',
    description: 'Google Meet link sent via email.',
    date: new Date(2025, 7, 14, 14, 30),
    link: '/mentee-meetings'
  }
];

export default function CheckHWTable() {
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    // Combine and sort by date ascending
    const combined = [...mockHomework, ...mockMeetings].sort(
      (a, b) => a.date - b.date
    );
    setCombinedData(combined);
  }, []);

  if (!combinedData.length) {
    return (
      <div className="check-hw-table no-data">
        <p className="no-homework">No upcoming items.</p>
      </div>
    );
  }

  return (
    <div className="check-hw-table">
      <div className="homework-list">
        {combinedData.map(item => (
          <Link
            to={item.link}
            key={`${item.type}-${item.id}`}
            className={`homework-card ${item.type.toLowerCase()}`}
          >
            <h2 className="homework-title">{item.title}</h2>
            <p className="homework-description">{item.description}</p>
            <p className="homework-date">
              {item.type === 'Homework' ? 'Due: ' : 'Scheduled: '}
              {format(item.date, 'MMMM dd, yyyy h:mm a')}
            </p>
            {item.type === 'Meeting' && (
              <p className="homework-date"><strong>Type:</strong> {item.type}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
