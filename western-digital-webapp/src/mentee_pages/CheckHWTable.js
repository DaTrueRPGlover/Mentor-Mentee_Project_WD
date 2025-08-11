// src/components/CheckHWTable.js
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import './CheckHWTable.css'; // Ensure this CSS file exists and is correctly styled

const CheckHWTable = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read user (but we won’t call APIs even if it’s missing)
  const userInfo = JSON.parse(sessionStorage.getItem('user')) || { menteekey: 9999, name: 'Mentee' };
  const menteeKey = userInfo?.menteekey;

  // ---- INLINE MOCK DATA (shared with other pages) ----
  const MOCK_HOMEWORK = [
    {
      homework_id: 101,
      title: "Arrays & Big-O",
      description:
        "Solve 5 array problems and write a short note on time complexity. Helpful ref: https://bigocheatsheet.io/",
      assigned_date: "2025-08-05T10:00:00Z",
      due_date: "2025-08-12T23:59:59Z",
    },
    {
      homework_id: 102,
      title: "SQL Joins Practice",
      description:
        "Complete the worksheet on INNER/LEFT/RIGHT joins using sample data. Try this sandbox: https://www.db-fiddle.com/",
      assigned_date: "2025-08-07T12:00:00Z",
      due_date: "2025-08-14T23:59:59Z",
    },
    {
      homework_id: 103,
      title: "React State & Props",
      description:
        "Build a small component demonstrating lifting state up and prop drilling. See docs: https://react.dev/",
      assigned_date: "2025-08-09T09:30:00Z",
      due_date: "2025-08-16T23:59:59Z",
    },
  ];

  const MOCK_MEETINGS = [
    {
      meetingkey: "mtg_1",
      mentor_name: "Alex Mentor",
      datetime: "2025-08-11T10:00:00",
      meeting_password: "abc123",
    },
    {
      meetingkey: "mtg_2",
      mentor_name: "Alex Mentor",
      datetime: "2025-08-12T14:00:00",
      meeting_password: "xyz789",
    },
  ];
  // ----------------------------------------------------

  useEffect(() => {
    const loadMockData = async () => {
      setLoading(true);
      setError(null);
      try {
        // simulate latency
        await new Promise((r) => setTimeout(r, 350));

        // Transform Homework Data
        const transformedHomework = (MOCK_HOMEWORK || []).map(hw => ({
          id: hw.homework_id,
          type: 'Homework',
          title: hw.title,
          description: hw.description,
          date: new Date(hw.due_date),
          link: `/homework/${hw.homework_id}`,
        }));

        // Transform Meetings Data
        const transformedMeetings = (MOCK_MEETINGS || []).map(meeting => ({
          id: meeting.meetingkey,
          type: 'Meeting',
          title: `Meeting with ${meeting.mentor_name}`,
          description: `Zoom Password: ${meeting.meeting_password}`,
          date: new Date(meeting.datetime),
          link: '/mentee-meetings', // keep same behavior
        }));

        // Combine and Sort
        const combined = [...transformedHomework, ...transformedMeetings].sort((a, b) => a.date - b.date);
        setCombinedData(combined);
      } catch (err) {
        console.error('Error loading mock data:', err);
        setError('Failed to load data (mock).');
      } finally {
        setLoading(false);
      }
    };

    loadMockData();
  }, [menteeKey]); // keep same dependency to preserve original structure

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
              to={item.type === 'Homework' ? item.link : '/mentee-meetings'}
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
