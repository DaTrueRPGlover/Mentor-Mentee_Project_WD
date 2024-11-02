import {pool} from '../database.js'

export const getMentorNotesByMeetingKey = async (meetingkey) => { // Fetch the mentor notes using the corresponding meetingkey
    const sql = `
        SELECT mentornotes.mentorkey,
               mentornotes.datetime,
               mentornotes.skipped,
               mentornotes.finished_homework,
               mentornotes.attitude_towards_learning,
               mentornotes.additional_comments
        FROM mentornotes 
        WHERE meetingkey = ?`; // Query to fetch mentor notes by meetingkey

    try {
        const [rows] = await pool.execute(sql, [meetingkey]); // Execute the query with the provided meetingkey
        return rows.length > 0 ? rows[0] : null; // Return the first row if exists, otherwise null
    } catch (error) {
        console.error('Error getting the mentor notes:', error); // Log error with context
        throw error;
    }
};

export const insertMentorNotes = async (
    meetingkey, 
    mentorkey, 
    datetime, 
    skipped = 0, 
    finishedHomework = 0, 
    attitudeTowardsLearning = 1, 
    additionalComments = ''
) => {
    const sql = `
        INSERT INTO mentornotes (
            meetingkey, 
            mentorkey, 
            datetime, 
            skipped, 
            finished_homework, 
            attitude_towards_learning, 
            additional_comments
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await pool.execute(sql, [
            meetingkey, 
            mentorkey, 
            datetime, 
            skipped, 
            finishedHomework, 
            attitudeTowardsLearning, 
            additionalComments
        ]);
        console.log('Mentor notes inserted with meetingkey:', meetingkey);
        return meetingkey;
    } catch (error) {
        console.error('Error inserting mentor notes:', error);
        throw error;
    }
};


console.log('Mentor Notes:', JSON.stringify(await getMentorNotesByMeetingKey('2f7adff3-9943-11ef-a92b-02a12f7436d7'), null, 2)); // This outputs mentor notes as a JSON with attributes and values

const mentorNotes = await getMentorNotesByMeetingKey('2f7adff3-9943-11ef-a92b-02a12f7436d7'); // Retrieves individual values for each attribute
console.log('Mentor Key: ', mentorNotes.mentorkey);
console.log('Date and Time: ', mentorNotes.datetime);
console.log('Skipped:', mentorNotes.skipped);
console.log('Finished Homework:', mentorNotes.finished_homework);
console.log('Attitude Towards Learning:', mentorNotes.attitude_towards_learning);
console.log('Additional Comments:', mentorNotes.additional_comments);
