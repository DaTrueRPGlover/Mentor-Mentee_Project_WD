import pool from '../database.js';
import bcrypt from 'bcryptjs/index.js';
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
    console.log('Creating mentor-mentee relationship...');
    const connection = await pool.getConnection();

    try {
        // Check if the relationship already exists
        const checkSql = `
            SELECT COUNT(*) AS count FROM mentor_mentee_relationship
            WHERE mentorkey = ? AND menteekey = ? AND end_date IS NULL
        `;
        const [checkResult] = await connection.execute(checkSql, [mentorkey, menteekey]);

        if (checkResult[0].count > 0) {
            throw new Error('Mentor and mentee are already assigned to each other');
        }

        // Relationship doesn't exist, proceed to create it
        const insertSql = `
            INSERT INTO mentor_mentee_relationship (mentorkey, menteekey, start_date)
            VALUES (?, ?, CURDATE())
        `;
        const [result] = await connection.execute(insertSql, [mentorkey, menteekey]);
        console.log('Created mentor-mentee relationship with ID:', result.insertId);
        return result.insertId;
    } catch (error) {
        console.error('Error creating mentor-mentee relationship:', error);
        throw error;
    } finally {
        connection.release();
    }
};

// Fetch mentor-mentee relationships
export const getMentorMenteeRelationships = async () => {
    console.log('Fetching mentor-mentee relationships...');
    const connection = await pool.getConnection();

    try {
        const query = `
            SELECT
                mmr.relationshipkey,
                mmr.mentorkey,
                mmr.menteekey,
                mmr.start_date,
                mmr.end_date,
                mentor.name AS mentor_name,
                mentor.lastname AS mentor_lastname,
                mentee.name AS mentee_name,
                mentee.lastname AS mentee_lastname
            FROM
                mentor_mentee_relationship mmr
            JOIN
                userInfo mentor ON mmr.mentorkey = mentor.userid
            JOIN
                userInfo mentee ON mmr.menteekey = mentee.userid
            WHERE
                mmr.end_date IS NULL;
        `;
        const [results] = await connection.execute(query);
        console.log('Fetched relationships:', results);
        return results;
    } catch (error) {
        console.error('Error fetching relationships:', error);
        throw error;
    } finally {
        connection.release();
    }
};


export const createAccount = async (firstName, lastName, email, password, department, role) => {
    console.log('Creating account with:', { firstName, lastName, email, department, role });
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const connection = await pool.getConnection(); // Get a connection from the pool

    try {
        await connection.beginTransaction(); // Start a transaction
        console.log('Transaction started');

        // Generate a new UUID for userId
        const userId = uuidv4();
        console.log('Generated userId:', userId);

        // Retrieve department_key from the departments table based on the department name
        const departmentKeyQuery = `SELECT department_key FROM departments WHERE department_name = ?`;
        const [departmentKeyResult] = await connection.execute(departmentKeyQuery, [department]);
        console.log('Department key result:', departmentKeyResult);

        // Check if department exists
        if (departmentKeyResult.length === 0) {
            throw new Error('Department not found');
        }

        const departmentKey = departmentKeyResult[0].department_key; // Get the department key

        // Insert the new user into the userInfo table, using department name instead of department key
        const newUsersql = `
            INSERT INTO userInfo (name, lastname, email, password, userid, role, department)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await connection.execute(newUsersql, [
            firstName,
            lastName,
            email,
            hashedPassword,
            userId, // Insert the generated UUID here
            role, // Insert the user's role
            department // Insert the department name
        ]);

        console.log('Inserted user into userInfo table with ID:', result.insertId);

        // Prepare the insert statement for the role-specific table with the department key
        let insertRoleSql;
        if (role === 'admin') {
            insertRoleSql = `
                INSERT INTO admin (name, departmentkey, email, adminkey)
                VALUES (?, ?, ?, ?)`;
            await connection.execute(insertRoleSql, [firstName, departmentKey, email, userId]);
            console.log('Inserted user into admin table');
        } else if (role === 'mentee') {
            insertRoleSql = `
                INSERT INTO mentee (name, departmentkey, email, menteekey)
                VALUES (?, ?, ?, ?)`; 
            await connection.execute(insertRoleSql, [firstName, departmentKey, email, userId]);
            console.log('Inserted user into mentee table');
        } else if (role === 'mentor') {
            insertRoleSql = `
                INSERT INTO mentor (name, departmentkey, email, mentorkey)
                VALUES (?, ?, ?, ?)`;
            await connection.execute(insertRoleSql, [firstName, departmentKey, email, userId]);
            console.log('Inserted user into mentor table');
        } else {
            throw new Error('Invalid role specified');
        }

        await connection.commit(); // Commit the transaction
        console.log('Transaction committed. New account created with ID:', userId);
        return userId; // Return the new user's ID
    } catch (error) {
        await connection.rollback(); // Rollback the transaction on error
        console.error('Error creating account:', error); // Better error logging
        throw error; // Rethrow the error for handling in the controller
    } finally {
        connection.release(); // Release the connection back to the pool
    }
};

export const updateAccount = async (userId, updates) => {
    const { firstName, lastName, email, password, department, role } = updates;
    console.log('Updating account with:', { userId, firstName, lastName, email, department, role });

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction(); // Start a transaction
        console.log('Transaction started for updating account');

        // Hash the password if provided
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
            console.log('Password hashed for update');
        }

        // Retrieve department_key from the departments table based on the department name
        const departmentKeyQuery = `SELECT department_key FROM departments WHERE department_name = ?`;
        const [departmentKeyResult] = await connection.execute(departmentKeyQuery, [department]);
        console.log('Department key result:', departmentKeyResult);

        // Check if department exists
        if (departmentKeyResult.length === 0) {
            throw new Error('Department not found');
        }

        const departmentKey = departmentKeyResult[0].department_key; // Get the department key

        // Update the userInfo table
        const updateUserInfoSql = `
            UPDATE userInfo 
            SET name = ?, lastname = ?, email = ?, 
                ${hashedPassword ? 'password = ?,' : ''} role = ?, department = ? 
            WHERE userid = ?
        `;
        const userInfoParams = [firstName, lastName, email];
        if (hashedPassword) userInfoParams.push(hashedPassword);
        userInfoParams.push(role, department, userId);
        
        const [userInfoResult] = await connection.execute(updateUserInfoSql, userInfoParams);
        console.log('Updated userInfo table:', userInfoResult);

        // Update role-specific tables based on role
        let updateRoleSql;
        const roleParams = [firstName, departmentKey, email, userId];

        if (role === 'admin') {
            updateRoleSql = `UPDATE admin SET name = ?, departmentkey = ?, email = ? WHERE adminkey = ?`;
        } else if (role === 'mentee') {
            updateRoleSql = `UPDATE mentee SET name = ?, departmentkey = ?, email = ? WHERE menteekey = ?`;
        } else if (role === 'mentor') {
            updateRoleSql = `UPDATE mentor SET name = ?, departmentkey = ?, email = ? WHERE mentorkey = ?`;
        } else {
            throw new Error('Invalid role specified');
        }

        const [roleResult] = await connection.execute(updateRoleSql, roleParams);
        console.log(`Updated ${role} table:`, roleResult);

        await connection.commit(); // Commit the transaction
        console.log('Transaction committed. Account updated for userId:', userId);
        return userId; // Return the user ID to confirm update
    } catch (error) {
        await connection.rollback(); // Rollback the transaction on error
        console.error('Error updating account:', error); // Log error
        throw error; // Rethrow for handling in controller
    } finally {
        connection.release(); // Release the connection
    }
};

// Fetch mentor names
export const getMentorNames = async () => {
    console.log('Fetching mentor names and roles...');
    const connection = await pool.getConnection();

    try {
        const query = `
            SELECT 
                userid,
                name,
                lastname,
                role
            FROM 
                userInfo
            WHERE 
                role = 'mentor';
        `;
        const [results] = await connection.execute(query);
        console.log('Fetched mentor names:', results);
        return results;
    } catch (error) {
        console.error('Error fetching mentor names:', error);
        throw error;
    } finally {
        connection.release();
    }
};

// Fetch mentee names
export const getMenteeNames = async () => {
    console.log('Fetching mentee names...');
    const connection = await pool.getConnection();

    try {
        const query = `
            SELECT 
                userid,
                name,
                lastname,
                role
            FROM 
                userInfo
            WHERE 
                role = 'mentee';
        `;
        const [results] = await connection.execute(query);
        console.log('Fetched mentee names:', results);
        return results;
    } catch (error) {
        console.error('Error fetching mentee names:', error);
        throw error;
    } finally {
        connection.release();
    }
};

export const updateMentorForMentee = async (menteekey, newMentorkey) => {
    console.log('Updating mentor for mentee...');
    const connection = await pool.getConnection();

    try {
        const sql = `
            UPDATE mentor_mentee_relationship
            SET mentorkey = ?
            WHERE menteekey = ? AND end_date IS NULL
        `;
        await connection.execute(sql, [newMentorkey, menteekey]);
        console.log('Mentor updated for mentee', menteekey);
    } catch (error) {
        console.error('Error updating mentor:', error);
        throw error;
    } finally {
        connection.release();
    }
};

// Test to insert new users into the database
/* try {
    const newUser = await createAccount("Test", "Mentee", "testmentee1@test.com", "testpassword", "testdepartment", "mentee");
    console.log("Account created successfully, new user ID: ", newUser);
} catch(error) {
    console.error("Failed to create account");
} */

/*
// Example usage of updateAccount function
try {
    const updatedUserId = await updateAccount('e89edb9d-7910-4316-8ebf-174ed2cdcd45', {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'newpassword',
        department: 'WHM',
        role: 'admin'
    });
    console.log('Account updated successfully for user ID:', updatedUserId);
} catch (error) {
    console.error('Failed to update account:', error);
}*/