import {pool} from '../database.js'

export const getMentorNotesByMeetingKey = async (meetingkey) => {
    const sql = `
      SELECT mentorkey, datetime, skipped, finished_homework, attitude_towards_learning, additional_comments
      FROM mentornotes
      WHERE meetingkey = ?
    `;
  
    try {
      const [rows] = await pool.execute(sql, [meetingkey]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error fetching mentor notes:', error);
      throw error;
    }
  };
  
  export const insertMentorNotes = async (meetingkey, mentorkey, datetime, skipped, finishedHomework, attitudeTowardsLearning, additionalComments) => {
    const sql = `
      INSERT INTO mentornotes (meetingkey, mentorkey, datetime, skipped, finished_homework, attitude_towards_learning, additional_comments)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    try {
      const [result] = await pool.execute(sql, [meetingkey, mentorkey, datetime, skipped, finishedHomework, attitudeTowardsLearning, additionalComments]);
      return result.insertId;
    } catch (error) {
      console.error('Error inserting mentor notes:', error);
      throw error;
    }
  };

export const updateMentorNotes = async (
    meetingkey, 
    mentorkey, 
    datetime, 
    skipped = 0, 
    finishedHomework = 0, 
    attitudeTowardsLearning = 1, 
    additionalComments = ''
) => {
    const sql = `
        UPDATE mentornotes
        SET
            datetime = ?, 
            skipped = ?, 
            finished_homework = ?, 
            attitude_towards_learning = ?, 
            additional_comments = ?
        WHERE 
            meetingkey = ? AND mentorkey = ?
    `;

    try {
        const [result] = await pool.execute(sql, [
            datetime, 
            skipped, 
            finishedHomework, 
            attitudeTowardsLearning, 
            additionalComments, 
            meetingkey, 
            mentorkey
        ]);

        if (result.affectedRows === 0) {
            console.log('No mentor note found to update for the provided meetingkey and mentorkey.');
            return null;
        }

        console.log('Mentor notes updated for meetingkey:', meetingkey);
        return result;
    } catch (error) {
        console.error('Error updating mentor notes:', error);
        throw error;
    }
};

/*
// Test function for updateMentorNotes
async function testUpdateMentorNotes() {
    const meetingkey = '2f7adff3-9943-11ef-a92b-02a12f7436d7'; // replace with an actual meeting key
    const mentorkey = '2f7eddd2-987f-11ef-a92b-02a12f7436d7';   // replace with an actual mentor key
    const datetime = new Date();
    const skipped = 1;
    const finishedHomework = 1;
    const attitudeTowardsLearning = 3; // Example value
    const additionalComments = 'This is a test update for mentor notes.';

    try {
        const result = await updateMentorNotes(
            meetingkey,
            mentorkey,
            datetime,
            skipped,
            finishedHomework,
            attitudeTowardsLearning,
            additionalComments
        );
        console.log('Update test result:', result);
    } catch (error) {
        console.error('Error during testUpdateMentorNotes:', error);
    }
}

// Run the test function
testUpdateMentorNotes();*/

/*
console.log('Mentor Notes:', JSON.stringify(await getMentorNotesByMeetingKey('2f7adff3-9943-11ef-a92b-02a12f7436d7'), null, 2)); // This outputs mentor notes as a JSON with attributes and values

const mentorNotes = await getMentorNotesByMeetingKey('2f7adff3-9943-11ef-a92b-02a12f7436d7'); // Retrieves individual values for each attribute
console.log('Mentor Key: ', mentorNotes.mentorkey);
console.log('Date and Time: ', mentorNotes.datetime);
console.log('Skipped:', mentorNotes.skipped);
console.log('Finished Homework:', mentorNotes.finished_homework);
console.log('Attitude Towards Learning:', mentorNotes.attitude_towards_learning);
console.log('Additional Comments:', mentorNotes.additional_comments);
*/