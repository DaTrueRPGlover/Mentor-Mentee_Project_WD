import React, { useState, useEffect } from 'react';
import './MentorMeetings.css';

function MentorMeetings({ mentorkey }) {
  const [meetings, setMeetings] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [zoomLink, setZoomLink] = useState('');
  const [zoomPassword, setZoomPassword] = useState('');

  useEffect(() => {
    // Fetch the mentor's mentee list on component load
    const fetchMentees = async () => {
      try {
        const mentorinfo = JSON.parse(localStorage.getItem('user'));
        const mentorkey = mentorinfo.mentorkey;
        const response = await fetch(`http://localhost:3001/api/meetings/mentees?mentorkey=${mentorkey}`);
        const data = await response.json();
        setMentees(data);
      } catch (error) {
        console.error('Error fetching mentees:', error);
      }
    };

    fetchMentees();
  }, [mentorkey]);

  const handleScheduleMeeting = async () => {
    if (selectedMentee && newDate.trim() && newTime.trim() && zoomLink.trim() && zoomPassword.trim()) {
      const datetime = `${newDate}T${newTime}`;
      const mentorinfo = JSON.parse(localStorage.getItem('user'));
      const mentorkey = mentorinfo.mentorkey;

      try {
        const response = await fetch('http://localhost:3001/api/meetings/create-meeting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mentorkey: mentorkey,
            menteekey: selectedMentee,
            datetime: datetime,
            zoom_link: zoomLink,
            zoom_password: zoomPassword,
          }),
        });

        if (response.status === 201) {
          setMeetings([...meetings, { mentee: selectedMentee, date: newDate, time: newTime }]);
          setSelectedMentee('');
          setNewDate('');
          setNewTime('');
          setZoomLink('');
          setZoomPassword('');
        } else if (response.status === 409) {
          alert('Time conflict! Please select a different time.');
        }
      } catch (error) {
        console.error('Error scheduling meeting:', error);
      }
    } else {
      alert("Please fill in all fields.");
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
        <input
          type="text"
          value={zoomLink}
          onChange={(e) => setZoomLink(e.target.value)}
          placeholder="Enter Zoom link"
        />
        <input
          type="text"
          value={zoomPassword}
          onChange={(e) => setZoomPassword(e.target.value)}
          placeholder="Enter Zoom password"
        />
        <button onClick={handleScheduleMeeting}>Schedule Meeting</button>
      </div>
    </div>
  );
}

export default MentorMeetings;
