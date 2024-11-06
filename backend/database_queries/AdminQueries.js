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




/*(async () => { //Previous test to check the connection of the database '8' is the initial key we had in our database's admin table
    try {
        const adminName = await getAdminNameByKey('8');
        console.log('Admin Name:', adminName);
    } catch (error) {
        console.error('Error fetching admin name:', error);
    }
})();*/


/*console.log('Admin name: ' + (await getAdminNameByKey('0c5dbe5d-9885-11ef-a92b-02a12f7436d7'))); //Test for fetching Admin Name; PASSED
console.log('Admin email: ' + (await getAdminEmailByKey('0c5dbe5d-9885-11ef-a92b-02a12f7436d7'))); //Test for fetching Admin Email; PASSED
console.log('Admin department key: ' + (await getAdminDepartmentKeyByKey('0c5dbe5d-9885-11ef-a92b-02a12f7436d7'))); //Test for fetching Admin Department Key; PASSED*/
//console.log('Admin username: ' + (await getAdminUsernameByKey('8'))); //Test for fetching Admin Username; PASSED
/*(async () => {
    try {
        console.log('Attempting to create a new account...');
        const userId = await createAccount('Hally', 'Honz', 'sample4@email.com', 'test4password', 'WDIN', 'mentee');
        console.log('Account created successfully with user ID:', userId);
    } catch (error) {
        console.error('Failed to create account:', error); // This will log any error that occurs
    }
})();*/