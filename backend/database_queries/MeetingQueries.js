import pool from '../database.js';

//get meeting for user query
export const getMeetingsForUser = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT 
      m.*, 
      u1.name AS mentor_name, 
      u2.name AS mentee_name,
      u1.userid AS mentorkey,
      u2.userid AS menteekey
    FROM 
      meetings m
    JOIN 
      userInfo u1 ON m.mentorkey = u1.userid
    JOIN 
      userInfo u2 ON m.menteekey = u2.userid
    WHERE 
      m.mentorkey = ? OR m.menteekey = ?
    `,
    [userId, userId]
  );
  return rows;
};

//query to get mentees for mentor
export const getMenteesForMentor = async (mentorkey) => {
  const [rows] = await pool.query(
    `
    SELECT u.userid AS menteekey, u.name AS mentee_name 
    FROM mentor_mentee_relationship r
    JOIN userInfo u ON r.menteekey = u.userid
    WHERE r.mentorkey = ?
    `,
    [mentorkey]
  );
  return rows;
};

// time conflict check before schedule
// Query to check for conflicting meetings
export const checkMeetingConflict = async (mentorkey, menteekey, datetime, duration, meetingKey = null) => {
  const [rows] = await pool.query(
    `
    SELECT * FROM meetings 
    WHERE (mentorkey = ? OR menteekey = ?) 
      AND meetingkey != ?
      AND (
        (datetime <= ? AND DATE_ADD(datetime, INTERVAL ? MINUTE) > ?) 
        OR 
        (datetime >= ? AND datetime < DATE_ADD(?, INTERVAL ? MINUTE))
      )
    `,
    [mentorkey, menteekey, meetingKey, datetime, duration, datetime, datetime, datetime, duration]
  );
  return rows;
};



export const getMeetingsByMenteeKey = async (menteekey) => {
    const sql = `
        SELECT meetingkey, mentorkey, menteekey, datetime, zoom_link, zoom_password
        FROM meetings
        WHERE menteekey = ?
        ORDER BY datetime DESC
    `;
    try {
        const [rows] = await pool.execute(sql, [menteekey]);
        return rows;
    } catch (error) {
        console.error('Error fetching meetings by menteekey:', error);
        throw error;
    }
};

// Query to create a new meeting
export const createMeeting = async (mentorkey, menteekey, datetime, zoom_link, zoom_password) => {
  await pool.query(
    `
    INSERT INTO meetings (meetingkey, mentorkey, menteekey, datetime, zoom_link, zoom_password)
    VALUES (UUID(), ?, ?, ?, ?, ?)
    `,
    [mentorkey, menteekey, datetime, zoom_link, zoom_password]
  );
};
export const cancelMeeting = async (meetingKey) => {
  await pool.query('DELETE FROM meetings WHERE meetingkey = ?', [meetingKey]);
};

export const rescheduleMeeting = async (meetingKey, newDateTime) => {
  await pool.query(
    'UPDATE meetings SET datetime = ? WHERE meetingkey = ?',
    [newDateTime, meetingKey]
  );
};
