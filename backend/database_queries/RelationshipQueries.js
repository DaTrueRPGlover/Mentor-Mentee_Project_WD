// database_queries/RelationshipQueries.js
import { pool } from '../database.js';

export const getMentorMenteeRelationship = async (userid, role) => {
  let sql, params;
  console.log("checking relationship");
  console.log("Role",role);
  console.log("userid",userid);
  if (role.toLowerCase() === 'mentee') {
    sql = `SELECT mentorkey FROM mentor_mentee_relationship WHERE menteekey = ?`;
    params = [userid];
  } else if (role.toLowerCase() === 'mentor') {
    sql = `SELECT menteekey FROM mentor_mentee_relationship WHERE mentorkey = ?`;
    params = [userid];
  } else {
    throw new Error('Invalid role');
  }

  console.log('getMentorMenteeRelationship sql:', sql, 'params:', params);

  const [rows] = await pool.execute(sql, params);

  if (rows.length === 0) {
    throw new Error('No relationship found');
  }

  return rows[0];
};
