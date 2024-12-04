// mentorAvailabilityQueries.js
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

// Check if a time is within mentor's availability
export const isTimeWithinMentorAvailability = async (mentorkey, datetime, duration) => {
  // Check if date is a blackout date
  const isBlackout = await isDateBlackout(mentorkey, datetime.toISOString().split('T')[0]);
  if (isBlackout) {
    return false;
  }

  const dayOfWeek = datetime.toLocaleString('en-US', { weekday: 'long' });

  const sql = `
    SELECT start_time, end_time
    FROM mentor_availability
    WHERE mentorkey = ? AND day_of_week = ?
  `;

  const [rows] = await pool.execute(sql, [mentorkey, dayOfWeek]);

  if (rows.length === 0) {
    return false;
  }

  const time = datetime.toTimeString().split(' ')[0];
  const endTime = new Date(datetime.getTime() + duration * 60 * 1000);
  const endTimeStr = endTime.toTimeString().split(' ')[0];

  for (const row of rows) {
    if (row.start_time <= time && row.end_time >= endTimeStr) {
      return true;
    }
  }

  return false;
};

// Check if a date is a blackout date
export const isDateBlackout = async (mentorkey, date) => {
  const sql = `
    SELECT * FROM mentor_blackout_dates
    WHERE mentorkey = ? AND date = ?
  `;
  const [rows] = await pool.execute(sql, [mentorkey, date]);
  return rows.length > 0;
};
