import pool from '../database.js';

// Query to get meetings for a user
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

// Query to fetch mentees for a specific mentor
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

// Query to check for time conflict before scheduling a meeting
export const checkMeetingConflict = async (mentorkey, datetime) => {
  const [rows] = await pool.query(
    `
    SELECT * FROM meetings 
    WHERE mentorkey = ? AND 
          datetime BETWEEN DATE_SUB(?, INTERVAL 30 MINUTE) AND DATE_ADD(?, INTERVAL 30 MINUTE)
    `,
    [mentorkey, datetime, datetime]
  );
  return rows;
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
