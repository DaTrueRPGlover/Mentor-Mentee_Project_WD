import pool from '../database.js';
import bcrypt from 'bcryptjs/index.js';


// Query to get user by email
console.log("login query here");
export const getUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM userInfo WHERE email = ?', [email]);
  return rows;
};

// Function to update the password if the current password is correct
export const updateUserPassword = async (userId, currentPassword, newPassword) => {
    try {
        // Step 1: Retrieve the existing hashed password from the database
        const [rows] = await pool.execute('SELECT password FROM userInfo WHERE userid = ?', [userId]);
        
        if (rows.length === 0) {
            throw new Error('User not found');
        }

        const storedHashedPassword = rows[0].password;

        // Step 2: Compare the current password with the stored hashed password
        const isMatch = await bcrypt.compare(currentPassword, storedHashedPassword);

        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }

        // Step 3: Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Step 4: Update the password in the database
        const [result] = await pool.execute(
            'UPDATE userInfo SET password = ? WHERE userid = ?',
            [hashedNewPassword, userId]
        );

        return result;

    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};

/*
const userId = '8f655a73-6dd7-422d-b8ef-f4b40bbbd693';
const currentPassword = 'test1password';
const newPassword = 'testpassword';

try {
  const result = await updateUserPassword(userId, currentPassword, newPassword);
  console.log('Password updated successfully:', result);
} catch (error) {
  console.error('Error updating password:', error);
}*/