import { pool } from '../database.js';

// Fetch availability for Mentor
export const getMentorAvailabilityByMentorKey = async (mentorkey) => {
  const sql = `
    SELECT 
      ma.day_of_week,
      ma.start_time,
      ma.end_time
    FROM mentor_availability AS ma
    WHERE ma.mentorkey = ?
    ORDER BY 
      CASE ma.day_of_week
        WHEN 'Monday' THEN 1
        WHEN 'Tuesday' THEN 2
        WHEN 'Wednesday' THEN 3
        WHEN 'Thursday' THEN 4
        WHEN 'Friday' THEN 5
        WHEN 'Saturday' THEN 6
        WHEN 'Sunday' THEN 7
      END, ma.start_time;
  `;
  
  const [rows] = await pool.execute(sql, [mentorkey]);
  return rows;
};

export const getMentorAvailabilityByDay = async (mentorkey, dayOfWeek) => {
    const sql = `
      SELECT 
        ma.day_of_week,
        ma.start_time,
        ma.end_time
      FROM mentor_availability AS ma
      WHERE ma.mentorkey = ?
        AND ma.day_of_week = ?
      ORDER BY ma.start_time;
    `;
  
    const [rows] = await pool.execute(sql, [mentorkey, dayOfWeek]);
  
    return rows; 
};

export const insertMentorAvailability = async (mentorkey, dayOfWeek, startTime, endTime) => {
    const sql = `
      INSERT INTO mentor_availability (mentorkey, day_of_week, start_time, end_time)
      VALUES (?, ?, ?, ?);
    `;
    
    await pool.execute(sql, [mentorkey, dayOfWeek, startTime, endTime]);
};
  
export const deleteMentorAvailability = async (mentorkey, dayOfWeek, startTime, endTime) => {
    const sql = `
      DELETE FROM mentor_availability
      WHERE mentorkey = ?
        AND day_of_week = ?
        AND start_time = ?
        AND end_time = ?;
    `;
  
    await pool.execute(sql, [mentorkey, dayOfWeek, startTime, endTime]);
};

export const updateMentorAvailability = async (mentorkey, dayOfWeek, oldStartTime, oldEndTime, newStartTime, newEndTime) => {
    const sql = `
      UPDATE mentor_availability
      SET start_time = ?, end_time = ?
      WHERE mentorkey = ?
        AND day_of_week = ?
        AND start_time = ?
        AND end_time = ?;
    `;
  
    await pool.execute(sql, [newStartTime, newEndTime, mentorkey, dayOfWeek, oldStartTime, oldEndTime]);
  };