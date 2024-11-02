import {pool} from './database.js'; //We import our connection so we can make some queries

export const getAdminNameByKey = async (adminkey) => { //Fetch admin name using the corresponding adminkey
    const sql = 'SELECT admin.name FROM admin WHERE adminkey = ?'; //SQL query on our MySQL database
    try {
        const [rows] = await pool.execute(sql, [adminkey]); //Await is needed so we are not returned just a promise
        return rows.length > 0 ? rows[0].name : null; //'rows[0].name' is there to not get unnecessary info
    } catch (error) {
        console.error('Error getting the name:', error);//Specify what you tried to fetch so we are able to easily debug
        throw error;
    }
};

export const getAdminEmailByKey = async (adminkey) => {
    const sql = 'SELECT admin.email FROM admin WHERE adminkey = ?';
    try {
        const [rows] = await pool.execute(sql, [adminkey]);
        return rows.length > 0 ? rows[0].email : null;
    } catch (error) {
        console.error('Error getting the email:', error);
        throw error;
    }
};

export const getAdminDepartmentKeyByKey = async (adminkey) => {
    const sql = 'SELECT admin.departmentkey FROM admin WHERE adminkey = ?';
    try {
        const [rows] = await pool.execute(sql, [adminkey]);
        return rows.length > 0 ? rows[0].departmentkey : null;
    } catch (error) {
        console.error('Error getting the department key:', error);
        throw error;
    }
};

/*export const getAdminUsernameByKey = async (adminkey) => {
    const sql = 'SELECT admin.username FROM admin WHERE adminkey = ?';
    try {
        const [rows] = await pool.execute(sql, [adminkey]);
        return rows.length > 0 ? rows[0].username : null;
    } catch (error) {
        console.error('Error getting the username:', error);
        throw error;
    }
}*/

export const createMentorMenteeRelationship = async (mentorkey, menteekey) => {
    const sql = `
    INSERT INTO mentor_mentee_relationship (mentorkey, menteekey, start_date)
    VALUES (?, ?, CURDATE())
    `;

    try {
        const [result] = await pool.execute(sql, [mentorkey, menteekey]);
        console.log('Relationship created with ID:', result.insertId);
        return result.insertId; // Returns the relationship ID
    } catch (error) {
        console.error('Error creating mentor-mentee relationship:', error);
        throw error;
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


console.log('Admin name: ' + (await getAdminNameByKey('0c5dbe5d-9885-11ef-a92b-02a12f7436d7'))); //Test for fetching Admin Name; PASSED
console.log('Admin email: ' + (await getAdminEmailByKey('0c5dbe5d-9885-11ef-a92b-02a12f7436d7'))); //Test for fetching Admin Email; PASSED
console.log('Admin department key: ' + (await getAdminDepartmentKeyByKey('0c5dbe5d-9885-11ef-a92b-02a12f7436d7'))); //Test for fetching Admin Department Key; PASSED
//console.log('Admin username: ' + (await getAdminUsernameByKey('8'))); //Test for fetching Admin Username; PASSED
