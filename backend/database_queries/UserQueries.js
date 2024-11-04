import pool from '../database.js';

// Query to get user by email
console.log("login query here");
export const getUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM userInfo WHERE email = ?', [email]);
  return rows;
};
