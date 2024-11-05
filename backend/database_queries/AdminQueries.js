import pool from '../database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Function to fetch admin name by key
export const getAdminNameByKey = async (adminkey) => {
    const sql = 'SELECT admin.name FROM admin WHERE adminkey = ?';
    try {
        const [rows] = await pool.execute(sql, [adminkey]);
        return rows.length > 0 ? rows[0].name : null;
    } catch (error) {
        console.error('Error getting admin name:', error);
        throw error;
    }
};

// Function to fetch admin email by key
export const getAdminEmailByKey = async (adminkey) => {
    const sql = 'SELECT admin.email FROM admin WHERE adminkey = ?';
    try {
        const [rows] = await pool.execute(sql, [adminkey]);
        return rows.length > 0 ? rows[0].email : null;
    } catch (error) {
        console.error('Error getting admin email:', error);
        throw error;
    }
};

// Function to create a mentor-mentee relationship
export const createMentorMenteeRelationship = async (mentorkey, menteekey) => {
    const sql = `
        INSERT INTO mentor_mentee_relationship (mentorkey, menteekey, start_date)
        VALUES (?, ?, CURDATE())
    `;
    try {
        const [result] = await pool.execute(sql, [mentorkey, menteekey]);
        console.log('Created mentor-mentee relationship with ID:', result.insertId);
        return result.insertId;
    } catch (error) {
        console.error('Error creating mentor-mentee relationship:', error);
        throw error;
    }
};

// Function to create a new account
export const createAccount = async (firstName, lastName, email, password, department, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const userId = uuidv4();

        // Retrieve department_key from the departments table based on department name
        const departmentKeyQuery = 'SELECT department_key FROM departments WHERE department_name = ?';
        const [departmentKeyResult] = await connection.execute(departmentKeyQuery, [department]);
        if (departmentKeyResult.length === 0) {
            throw new Error('Department not found');
        }
        const departmentKey = departmentKeyResult[0].department_key;

        // Insert user into userInfo table
        const userInfoQuery = `
            INSERT INTO userInfo (name, lastname, email, password, userid)
            VALUES (?, ?, ?, ?, ?)
        `;
        await connection.execute(userInfoQuery, [firstName, lastName, email, hashedPassword, userId]);

        // Role-specific table insert
        let roleInsertQuery;
        if (role === 'admin') {
            roleInsertQuery = `
                INSERT INTO admin (name, departmentkey, email, adminkey)
                VALUES (?, ?, ?, ?)
            `;
        } else if (role === 'mentor') {
            roleInsertQuery = `
                INSERT INTO mentor (name, departmentkey, email, mentorkey)
                VALUES (?, ?, ?, ?)
            `;
        } else if (role === 'mentee') {
            roleInsertQuery = `
                INSERT INTO mentee (name, departmentkey, email, menteekey)
                VALUES (?, ?, ?, ?)
            `;
        } else {
            throw new Error('Invalid role specified');
        }
        await connection.execute(roleInsertQuery, [firstName, departmentKey, email, userId]);

        await connection.commit();
        console.log('Account created successfully with userId:', userId);
        return userId;
    } catch (error) {
        await connection.rollback();
        console.error('Error creating account:', error);
        throw error;
    } finally {
        connection.release();
    }
};