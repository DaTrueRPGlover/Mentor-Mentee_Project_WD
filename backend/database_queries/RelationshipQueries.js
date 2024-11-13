// RelationshipQueries.js

import { pool } from '../database.js';

// Fetch all mentor-mentee relationships
export const getAllMentorMenteeRelationships = async () => {
  const sql = `
    SELECT 
      r.relationshipkey AS relationship_id,
      m.userid AS mentor_id, 
      m.name AS mentor_name, 
      m.lastname AS mentor_lastname,
      t.userid AS mentee_id,
      t.name AS mentee_name,
      t.lastname AS mentee_lastname
    FROM mentor_mentee_relationship AS r
    JOIN userInfo AS m ON r.mentorkey = m.userId
    JOIN userInfo AS t ON r.menteekey = t.userId;
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

// Assign a mentor to a mentee
export const createMentorMenteeRelationship = async (mentorkey, menteekey) => {
  const sql = `
    INSERT INTO mentor_mentee_relationship (mentorkey, menteekey, start_date)
    VALUES (?, ?, NOW())
  `;
  await pool.execute(sql, [mentorkey, menteekey]);
};

// Update mentor for a mentee
export const updateMentorForMentee = async (menteekey, mentorkey) => {
  const sql = `
    UPDATE mentor_mentee_relationship
    SET mentorkey = ?
    WHERE menteekey = ?
  `;
  await pool.execute(sql, [mentorkey, menteekey]);
};

// Delete a mentor-mentee relationship
export const deleteMentorMenteeRelationship = async (relationship_id) => {
  const sql = `
    DELETE FROM mentor_mentee_relationship
    WHERE relationshipkey = ?
  `;
  await pool.execute(sql, [relationship_id]);
};
