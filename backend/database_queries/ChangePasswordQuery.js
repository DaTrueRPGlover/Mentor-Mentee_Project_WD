import {pool} from '../database.js';
import bcrypt from 'bcryptjs/index.js';

export const changePassword = async (userId, newPassword) => {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // SQL statement for updating the password
    const sql = 'UPDATE userInfo SET password = ? WHERE userid = ?';

    try {
        const [result] = await pool.execute(sql, [hashedPassword, userId]);
        if (result.affectedRows === 0) {
            throw new Error('User not found');
        }
        console.log('Password updated successfully');
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};
