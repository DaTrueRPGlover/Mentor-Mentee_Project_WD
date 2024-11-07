// database_queries/RelationshipQueries.js
import { pool } from '../database.js';

export const getMentorMenteeRelationships = async (userid, role) => {
  let sql, params;
  console.log('Checking relationship');
  console.log('Role:', role);
  console.log('UserID:', userid);

  if (role.toLowerCase() === 'mentee') {
    sql = `
      SELECT m.mentorkey, u.name AS mentorName
      FROM mentor_mentee_relationship AS m
      JOIN userInfo AS u ON m.mentorkey = u.userId
      WHERE m.menteekey = ?
    `;
    params = [userid];
  } else if (role.toLowerCase() === 'mentor') {
    sql = `
      SELECT m.menteekey, u.name AS menteeName
      FROM mentor_mentee_relationship AS m
      JOIN userInfo AS u ON m.menteekey = u.userId
      WHERE m.mentorkey = ?
    `;
    params = [userid];
  } else {
    throw new Error('Invalid role');
  }

  const [rows] = await pool.execute(sql, params);

  console.log('Fetched relationships:', rows);

  return rows;
};
