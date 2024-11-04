import React, { useState, useEffect } from 'react';
import './MentorMeetings.css';

function MentorMeetings({ mentorkey }) {
  const [meetings, setMeetings] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    // Fetch the mentor's mentee list on component load
    const fetchMentees = async () => {
      try {
        const response = await fetch(`http://localhost:3001/mentees?mentorkey=${mentorkey}`);
        const data = await response.json();
        setMentees(data);
      } catch (error) {
        console.error('Error fetching mentees:', error);
      }
    };

    fetchMentees();
  }, [mentorkey]);

  const handleScheduleMeeting = async () => {
    if (selectedMentee && newDate.trim() && newTime.trim()) {
      const datetime = `${newDate}T${newTime}`;
      
      try {
        const response = await fetch('http://localhost:3001/create-meeting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mentorkey,
            menteekey: selectedMentee,
            datetime: datetime,
            zoom_link: 'https://zoom.us/j/123456789', // Example link
            zoom_password: 'password123', // Example password
          }),
        });

        if (response.status === 201) {
          setMeetings([...meetings, { mentee: selectedMentee, date: newDate, time: newTime }]);
          setSelectedMentee('');
          setNewDate('');
          setNewTime('');
        } else if (response.status === 409) {
          alert('Time conflict! Please select a different time.');
        }
      } catch (error) {
        console.error('Error scheduling meeting:', error);
      }
    }
  };

  return (
    <div className="mentor-meetings">
      <h1>Scheduled Meetings with Mentees</h1>
      <ul>
        {meetings.map((meeting, index) => (
          <li key={index}>
            Meeting with <strong>{meeting.mentee}</strong> on {meeting.date} at {meeting.time}
          </li>
        ))}
      </ul>

      <h2>Schedule a New Meeting</h2>
      <div className="schedule-form">
        <select
          value={selectedMentee}
          onChange={(e) => setSelectedMentee(e.target.value)}
        >
          <option value="">Select a Mentee</option>
          {mentees.map((mentee) => (
            <option key={mentee.menteekey} value={mentee.menteekey}>
              {mentee.mentee_name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
        />
        <button onClick={handleScheduleMeeting}>Schedule Meeting</button>
      </div>
    </div>
  );
}

export default MentorMeetings;
