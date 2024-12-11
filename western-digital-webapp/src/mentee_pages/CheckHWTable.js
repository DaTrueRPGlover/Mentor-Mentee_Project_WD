// src/components/CheckHWTable.js
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import './CheckHWTable.css'; // Ensure this CSS file exists and is correctly styled

const CheckHWTable = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = JSON.parse(sessionStorage.getItem('user'));
  const menteeKey = userInfo?.menteekey;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!menteeKey) {
          throw new Error('Mentee key not found.');
        }

        // Fetch Homework Data
        const homeworkResponse = await fetch(`http://localhost:3001/api/homework/mentee/${menteeKey}`);
        if (!homeworkResponse.ok) {
          throw new Error('Failed to fetch homework data.');
        }
        const homeworkData = await homeworkResponse.json() || [];

        // Fetch Meetings Data
        const meetingsResponse = await fetch(`http://localhost:3001/api/meetings/meetings?userId=${menteeKey}`);
        if (!meetingsResponse.ok) {
          throw new Error('Failed to fetch meetings data.');
        }
        const meetingsData = await meetingsResponse.json() || [];

        // Transform Homework Data
        const transformedHomework = homeworkData.map(hw => ({
          id: hw.homework_id,
          type: 'Homework',
          title: hw.title,
          description: hw.description,
          date: new Date(hw.due_date),
          link: `/homework/${hw.homework_id}`,
        }));

        // Transform Meetings Data
        const transformedMeetings = meetingsData.map(meeting => ({
          id: meeting.meetingkey,
          type: 'Meeting',
          title: `Meeting with ${meeting.mentor_name}`,
          description: `Zoom Password: ${meeting.meeting_password}`,
          date: new Date(meeting.datetime),
          link: meeting.zoomLink || '#', // Assuming zoomLink is provided
        }));

        // Combine and Sort Data
        const combined = [...transformedHomework, ...transformedMeetings].sort((a, b) => a.date - b.date);

        setCombinedData(combined);
      } catch (err) {
        setError(err.message || 'An unexpected error occurred.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [menteeKey]);

  if (loading) return <div className="check-hw-table loading">Loading...</div>;
  if (error) return <div className="check-hw-table error">{error}</div>;

  return (
    <div className="check-hw-table">
      {combinedData.length === 0 ? (
        <p className="no-homework">No upcoming meetings or assignments found.</p>
      ) : (
        <div className="homework-list">
          {combinedData.map(item => (
            <Link
              to={item.type === 'Homework' ? item.link : '#'} // Only Homework has a valid internal link
              key={`${item.type}-${item.id}`}
              className={`homework-card ${item.type.toLowerCase()}`}
              onClick={item.type === 'Meeting' ? (e) => {
                e.preventDefault();
                window.open(item.link, '_blank', 'noopener,noreferrer');
              } : null}
            >
              <h2 className="homework-title">{item.title}</h2>
              <p className="homework-description">{item.description}</p>
              <p className="homework-date">
                {item.type === 'Homework' ? 'Due: ' : 'Scheduled: '}
                {format(item.date, 'MMMM dd, yyyy h:mm a')}
              </p>
              {item.type === 'Meeting' && (
                <p className="homework-date">
                  <strong>Type:</strong> {item.type}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckHWTable;
