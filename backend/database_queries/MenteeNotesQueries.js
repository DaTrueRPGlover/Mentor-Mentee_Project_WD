import {pool} from '../database.js';

export const getMenteeNotesByMeetingKey = async (meetingkey) => { //Fetch the mentee notes using the corresponding meetingkey
    const sql = `SELECT menteenotes.menteekey, 
    menteenotes.datetime, 
    menteenotes.profile_of_a_leader, 
    menteenotes.executive_communication_style,
    menteenotes.trust_respect_visibility, 
    menteenotes.motivating_your_team, 
    menteenotes.self_advocacy_and_career_growth,
    menteenotes.work_life_balance,
    menteenotes.additional_comments 
    FROM menteenotes 
    WHERE meetingkey = ?`; //SQL query on our MySQL database '?' is an untrusted key, read documentation about it
    try {
        const [rows] = await pool.execute(sql, [meetingkey]); //Await is needed so we are not returned just a promise
        return rows.length > 0 ? rows[0] : null; //'rows[0].name' is there to not get unnecessary info
    } catch (error) {
        console.error('Error getting the mentee notes:', error);//Specify what you tried to fetch so we are able to easily debug
        throw error;
    }
};

export const insertMenteeNote = async (meetingkey, menteekey, datetime, profileOfALeader, executiveCommunicationStyle, trustRespectVisibility, motivatingYourTeam, selfAdvocacyAndCareerGrowth, workLifeBalance, additionalComments) => {
    const sql = `
        INSERT INTO menteenotes (
            meetingkey, 
            menteekey, 
            datetime, 
            profile_of_a_leader, 
            executive_communication_style,
            trust_respect_visibility, 
            motivating_your_team, 
            self_advocacy_and_career_growth,
            work_life_balance,
            additional_comments
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        // Execute the query with parameterized values for security
        const [result] = await pool.execute(sql, [
            meetingkey,
            menteekey,
            datetime,
            profileOfALeader,
            executiveCommunicationStyle,
            trustRespectVisibility,
            motivatingYourTeam,
            selfAdvocacyAndCareerGrowth,
            workLifeBalance,
            additionalComments
        ]);

        return result; // Returns the result, which includes the inserted row ID
    } catch (error) {
        console.error('Error inserting mentee note:', error);
        throw error; // Rethrow to handle it in the calling function
    }
};

/*// Example data to insert
const meetingkey = 'e7c27601-9ae1-11ef-a92b-02a12f7436d7';
const menteekey = '2d9f4b3a-987f-11ef-a92b-02a12f7436d7';
const datetime = new Date();
const profileOfALeader = 3;
const executiveCommunicationStyle = 2;
const trustRespectVisibility = 1;
const motivatingYourTeam = 3;
const selfAdvocacyAndCareerGrowth = 1;
const workLifeBalance = 3;
const additionalComments = 'Mentee is making good progress on goals.';

try {
    const result = await insertMenteeNote(
        meetingkey,
        menteekey,
        datetime,
        profileOfALeader,
        executiveCommunicationStyle,
        trustRespectVisibility,
        motivatingYourTeam,
        selfAdvocacyAndCareerGrowth,
        workLifeBalance,
        additionalComments
    );
    console.log('Mentee note inserted successfully:', result);
} catch (error) {
    console.error('Error inserting mentee note:', error);
}*/


/*console.log('Mentee Notes:', JSON.stringify(await getMenteeNotesByMeetingKey('2f7adff3-9943-11ef-a92b-02a12f7436d7'), null, 2)); //This way makes the output come as a list of attributes with their value


const menteeNotes = await getMenteeNotesByMeetingKey('2f7adff3-9943-11ef-a92b-02a12f7436d7'); //This way accesses just the values of each attribute
console.log('Mentee Key: ', menteeNotes.menteekey);
console.log('Date and Time: ', menteeNotes.datetime);
console.log('Profile of a Leader:', menteeNotes.profile_of_a_leader); 
console.log('Executive Communication Style:', menteeNotes.executive_communication_style);
console.log('Trust, respect, and visibility:', menteeNotes.trust_respect_visibility);
console.log('Motivating Your Team:', menteeNotes.motivating_your_team);
console.log('Self Advocacy and Career Growth:', menteeNotes.self_advocacy_and_career_growth);
console.log('Work-Life Balance:', menteeNotes.work_life_balance);
console.log('Additional Comments:', menteeNotes.additional_comments);

/*insert into meetings values (UUID(), '2f7eddd2-987f-11ef-a92b-02a12f7436d7', '2d9f4b3a-987f-11ef-a92b-02a12f7436d7', NOW(), 'zoom.com/mymeeting', '2020');

insert into menteenotes values('2f7adff3-9943-11ef-a92b-02a12f7436d7', '2d9f4b3a-987f-11ef-a92b-02a12f7436d7', NOW(), '3', '2', '1', '3', '1', '3');

insert into mentornotes values('2f7adff3-9943-11ef-a92b-02a12f7436d7', '2f7eddd2-987f-11ef-a92b-02a12f7436d7', NOW(), 0, 1, 3, 'Mentee needds to learn to manage his workplace');*/