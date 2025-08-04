// src/components/CheckHWTable.js
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import './AssignHW.css';

const CheckHWTable = () => {
  const [meetingsData, setMeetingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy data
  const dummyMeetings = [
    {
      id: 'm1',
      type: 'Meeting',
      title: 'Meeting with Alice',
      description: 'Zoom Password: 123456',
      date: new Date('2025-08-05T14:00:00'),
    },
    {
      id: 'm2',
      type: 'Meeting',
      title: 'Meeting with Bob',
      description: 'Zoom Password: 654321',
      date: new Date('2025-08-06T11:30:00'),
    },
  ];

  useEffect(() => {
    // Simulate async fetch
    setTimeout(() => {
      const sortedMeetings = dummyMeetings.sort((a, b) => a.date - b.date);
      setMeetingsData(sortedMeetings);
      setLoading(false);
    }, 500); // Simulate loading delay
  }, []);

  if (loading) return <div className="check-hw-table loading">Loading...</div>;

  return (
    <div className="check-hw-table1">
      {meetingsData.length === 0 ? (
        <p className="no-homework">No upcoming meetings found.</p>
      ) : (
        <div className="homework-list">
          {meetingsData.map(item => (
            <Link
              to="/mentor-meetings"
              key={item.id}
              className="homework-card meeting"
            >
              <h2 className="homework-title">{item.title}</h2>
              <p className="homework-description">{item.description}</p>
              <p className="homework-date">
                Scheduled: {format(item.date, 'MMMM dd, yyyy h:mm a')}
              </p>
              <p className="homework-date">
                <strong>Type:</strong> {item.type}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckHWTable;







// // src/components/CheckHWTable.js
// import React, { useEffect, useState } from 'react';
// import { format } from 'date-fns';
// import { Link } from 'react-router-dom';
// import './AssignHW.css'; // Ensure this CSS file exists and is correctly styled

// const CheckHWTable = () => {
//   const [meetingsData, setMeetingsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const userInfo = JSON.parse(sessionStorage.getItem('user'));
//   const mentorKey = userInfo?.mentorkey;

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         if (!mentorKey) {
//           throw new Error('Mentee key not found.');
//         }

//         // Fetch Meetings Data
//         const meetingsResponse = await fetch(`http://localhost:3001/api/meetings/meetings?userId=${mentorKey}`);
//         if (!meetingsResponse.ok) {
//           throw new Error('Failed to fetch meetings data.');
//         }
//         const data = await meetingsResponse.json() || [];

//         // Transform Meetings Data
//         const transformedMeetings = data.map(meeting => ({
//           id: meeting.meetingkey,
//           type: 'Meeting',
//           title: `Meeting with ${meeting.mentee_name}`,
//           description: `Zoom Password: ${meeting.meeting_password}`,
//           date: new Date(meeting.datetime),
//         }));

//         // Sort Meetings Data
//         const sortedMeetings = transformedMeetings.sort((a, b) => a.date - b.date);

//         setMeetingsData(sortedMeetings);
//       } catch (err) {
//         setError(err.message || 'An unexpected error occurred.');
//         console.error('Error fetching data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [mentorKey]);

//   if (loading) return <div className="check-hw-table loading">Loading...</div>;
//   if (error) return <div className="check-hw-table error">{error}</div>;

//   return (
//     <div className="check-hw-table1">
//       {meetingsData.length === 0 ? (
//         <p className="no-homework">No upcoming meetings found.</p>
//       ) : (
//         <div className="homework-list">
//           {meetingsData.map(item => (
//             <Link
//               to="/mentor-meetings"
//               key={item.id}
//               className="homework-card meeting"
//             >
//               <h2 className="homework-title">{item.title}</h2>
//               <p className="homework-description">{item.description}</p>
//               <p className="homework-date">
//                 Scheduled: {format(item.date, 'MMMM dd, yyyy h:mm a')}
//               </p>
//               <p className="homework-date">
//                 <strong>Type:</strong> {item.type}
//               </p>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckHWTable;
