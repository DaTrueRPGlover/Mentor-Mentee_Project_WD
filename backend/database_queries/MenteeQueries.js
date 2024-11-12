import {pool} from '../database.js';

export const getMenteeNameByKey = async (menteekey) => { //Fetch mentee name using the corresponding menteekey
    const sql = 'SELECT mentee.name FROM mentee WHERE menteekey = ?'; //SQL query on our MySQL database '?' is an untrusted key, read documentation about it
    try {
        const [rows] = await pool.execute(sql, [menteekey]); //Await is needed so we are not returned just a promise
        return rows.length > 0 ? rows[0].name : null; //'rows[0].name' is there to not get unnecessary info
    } catch (error) {
        console.error('Error getting the name:', error);//Specify what you tried to fetch so we are able to easily debug
        throw error;
    }
};

export const getMentorKeyByMenteeKey = async (menteekey) => {
    const sql = `
        SELECT mentorkey 
        FROM mentor_mentee_relationship 
        WHERE menteekey = ?
    `;
    try {
        const [rows] = await pool.execute(sql, [menteekey]);
        return rows.length > 0 ? rows[0].mentorkey : null; // Returns the mentor's UUID or null if not found
    } catch (error) {
        console.error('Error getting the mentor key:', error);
        throw error;
    }
};

export const getMenteeEmailByKey = async (menteekey) => {
    const sql = 'SELECT mentee.email FROM mentee WHERE menteekey = ?';
    try {
        const [rows] = await pool.execute(sql, [menteekey]);
        return rows.length > 0 ? rows[0].email : null;
    } catch (error) {
        console.error('Error getting the email:', error);
        throw error;
    }
};

export const getMenteeDepartmentKeyByKey = async (menteekey) => {
    const sql = 'SELECT mentee.departmentkey FROM mentee WHERE menteekey = ?';
    try {
        const [rows] = await pool.execute(sql, [menteekey]);
        return rows.length > 0 ? rows[0].departmentkey : null;
    } catch (error) {
        console.error('Error getting the department key:', error);
        throw error;
    }
};

/*export const getMenteeUsernameByKey = async (menteekey) => {
    const sql = 'SELECT mentee.username FROM mentee WHERE menteekey = ?';
    try {
        const [rows] = await pool.execute(sql, [menteekey]);
        return rows.length > 0 ? rows[0].username : null;
    } catch (error) {
        console.error('Error getting the username:', error);
        throw error;
    }
};*/

// console.log('Mentee name: ' + await getMenteeNameByKey('2d9f4b3a-987f-11ef-a92b-02a12f7436d7'));
// console.log('Mentee mentorkey: ' + await getMentorKeyByMenteeKey('2d9f4b3a-987f-11ef-a92b-02a12f7436d7'));
// console.log('Mentee email: ' + await getMenteeEmailByKey('2d9f4b3a-987f-11ef-a92b-02a12f7436d7'));
// //console.log('Mentee username: ' + await getMenteeUsernameByKey('10'));
// console.log('Mentee departmentkey: ' + await getMenteeDepartmentKeyByKey('2d9f4b3a-987f-11ef-a92b-02a12f7436d7'));