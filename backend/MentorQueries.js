import {pool} from './database.js'

export const getMentorNameByKey = async (mentorkey) => { //Fetch mentor name using the corresponding mentorkey
    const sql = 'SELECT mentor.name FROM mentor WHERE mentorkey = ?'; //SQL query on our MySQL database '?' is an untrusted key, read documentation about it
    try {
        const [rows] = await pool.execute(sql, [mentorkey]); //Await is needed so we are not returned just a promise
        return rows.length > 0 ? rows[0].name : null; //'rows[0].name' is there to not get unnecessary info
    } catch (error) {
        console.error('Error getting the name (Mentor):', error);//Specify what you tried to fetch so we are able to easily debug
        throw error;
    }
};

export const getMenteeKeyByMentorKey = async (mentorkey) => {
    const sql = `
        SELECT menteekey 
        FROM mentor_mentee_relationship 
        WHERE mentorkey = ?
    `;
    try {
        const [rows] = await pool.execute(sql, [mentorkey]);
        return rows.length > 0 ? rows[0].menteekey : null; // Returns the mentee's UUID or null if not found
    } catch (error) {
        console.error('Error getting the mentee key:', error);
        throw error;
    }
};

export const getMentorDepartmentKeyByKey = async (mentorkey) => { 
    const sql = 'SELECT mentor.departmentkey FROM mentor WHERE mentorkey = ?'; 
    try {
        const [rows] = await pool.execute(sql, [mentorkey]);
        return rows.length > 0 ? rows[0].departmentkey : null; 
    } catch (error) {
        console.error('Error getting the departmentkey (Mentor):', error);
        throw error;
    }
};

export const getMentorEmailByKey = async (mentorkey) => { 
    const sql = 'SELECT mentor.email FROM mentor WHERE mentorkey = ?'; 
    try {
        const [rows] = await pool.execute(sql, [mentorkey]);
        return rows.length > 0 ? rows[0].email : null; 
    } catch (error) {
        console.error('Error getting the email (Mentor):', error);
        throw error;
    }
};

/*export const getMentorUsernameByKey = async (mentorkey) => { 
    const sql = 'SELECT mentor.username FROM mentor WHERE menteekey = ?'; 
    try {
        const [rows] = await pool.execute(sql, [mentorkey]);
        return rows.length > 0 ? rows[0].username : null; 
    } catch (error) {
        console.error('Error getting the username (Mentor):', error);
        throw error;
    }
};*/

console.log('Mentor name: ' + await getMentorNameByKey('2f7eddd2-987f-11ef-a92b-02a12f7436d7'));
console.log('Mentor email: ' + await getMentorEmailByKey('2f7eddd2-987f-11ef-a92b-02a12f7436d7'));
//console.log('Mentor username: ' + await getMentorUsernameByKey('10'));
console.log('Mentor departmentkey: ' + await getMentorDepartmentKeyByKey('2f7eddd2-987f-11ef-a92b-02a12f7436d7'));
console.log('Mentee key: ' + await getMenteeKeyByMentorKey('2f7eddd2-987f-11ef-a92b-02a12f7436d7'))