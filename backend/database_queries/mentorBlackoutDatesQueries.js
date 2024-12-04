// mentorBlackoutDatesQueries.js
import { pool } from '../database.js';

// Fetch blackout dates for Mentor
export const getBlackoutDatesByMentorKey = async (mentorkey) => {
  const sql = `
    SELECT date, reason
    FROM mentor_blackout_dates
    WHERE mentorkey = ?
    ORDER BY date;
  `;
  const [rows] = await pool.execute(sql, [mentorkey]);
  return rows;
};

// Insert new blackout date
export const insertBlackoutDate = async (mentorkey, date, reason) => {
  const sql = `
    INSERT INTO mentor_blackout_dates (mentorkey, date, reason)
    VALUES (?, ?, ?);
  `;
  await pool.execute(sql, [mentorkey, date, reason]);
};

// Delete blackout date
export const deleteBlackoutDate = async (mentorkey, date) => {
  const sql = `
    DELETE FROM mentor_blackout_dates
    WHERE mentorkey = ? AND date = ?;
  `;
  await pool.execute(sql, [mentorkey, date]);
};
