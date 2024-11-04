import {pool} from './database.js';

export const createHomework = async (menteeKey, mentorKey, title, description, assignedDate, dueDate) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        console.log('Transaction started');

        // Check if mentor exists in the mentor table
        const mentorCheckQuery = `
            SELECT 1 FROM mentor WHERE mentorkey = ?`;
        const [mentorResult] = await connection.execute(mentorCheckQuery, [mentorKey]);

        if (mentorResult.length === 0) {
            throw new Error('Mentor not found');
        }
        console.log('Mentor exists with mentorkey:', mentorKey);

        // Check if mentee exists in the mentee table
        const menteeCheckQuery = `
            SELECT 1 FROM mentee WHERE menteekey = ?`;
        const [menteeResult] = await connection.execute(menteeCheckQuery, [menteeKey]);

        if (menteeResult.length === 0) {
            throw new Error('Mentee not found');
        }
        console.log('Mentee exists with menteekey:', menteeKey);

        // Insert new homework entry into the homework table
        const insertHomeworkQuery = `
            INSERT INTO homework (mentorkey, menteekey, title, description, assigned_date, due_date)
            VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await connection.execute(insertHomeworkQuery, [
            mentorKey,
            menteeKey,
            title,
            description,
            assignedDate,
            dueDate
        ]);

        console.log('Inserted homework with ID:', result.insertId);

        await connection.commit();
        console.log('Transaction committed. Homework entry created.');
        return result.insertId; // Return the new homework's ID
    } catch (error) {
        await connection.rollback();
        console.error('Error creating homework entry:', error);
        throw error;
    } finally {
        connection.release();
    }
};

export const fetchHomeworkByMenteeKey = async (menteeKey) => {
    const connection = await pool.getConnection();

    try {
        // Query to retrieve homework entries for the specified menteekey
        const fetchHomeworkQuery = `
            SELECT homework_id, mentorkey, menteekey, title, description, assigned_date, due_date
            FROM homework
            WHERE menteekey = ?`;
        
        const [homeworkResults] = await connection.execute(fetchHomeworkQuery, [menteeKey]);

        console.log(`Fetched ${homeworkResults.length} homework entries for menteekey:`, menteeKey);
        
        return homeworkResults; // Return the homework entries as an array
    } catch (error) {
        console.error('Error fetching homework entries:', error);
        throw error;
    } finally {
        connection.release();
    }
};

export const fetchHomeworkByMentorKey = async (mentorKey) => {
    const connection = await pool.getConnection();

    try {
        // Query to retrieve homework entries for the specified mentorkey
        const fetchHomeworkQuery = `
            SELECT homework_id, mentorkey, menteekey, title, description, assigned_date, due_date
            FROM homework
            WHERE mentorkey = ?`;
        
        const [homeworkResults] = await connection.execute(fetchHomeworkQuery, [mentorKey]);

        console.log(`Fetched ${homeworkResults.length} homework entries for mentorkey:`, mentorKey);
        
        return homeworkResults; // Return the homework entries as an array
    } catch (error) {
        console.error('Error fetching homework entries:', error);
        throw error;
    } finally {
        connection.release();
    }
};


/*// Example mentor key
const mentorKey = '1b43e495-ffe9-4593-8c61-61261433a97f'; // Replace with an actual mentor key

// Fetch homework for a specific mentor
fetchHomeworkByMentorKey(mentorKey)
    .then(homeworkEntries => {
        console.log('Retrieved homework entries for mentor:', homeworkEntries);
    })
    .catch(error => {
        console.error('Error retrieving homework for mentor:', error);
    });*/




/*// Example mentee key
const menteeKey = '474b2c7c-3fbe-474c-ac1e-58c9e47e157b'; // Replace with an actual mentee key

// Fetch homework for a specific mentee
fetchHomeworkByMenteeKey(menteeKey)
    .then(homeworkEntries => {
        console.log('Retrieved homework entries for mentee:', homeworkEntries);
    })
    .catch(error => {
        console.error('Error retrieving homework for mentee:', error);
    });*/


/*const insertHomeworkExample = async () => {
    const menteeKey = '474b2c7c-3fbe-474c-ac1e-58c9e47e157b'; // Replace with an actual mentee key
    const mentorKey = '1b43e495-ffe9-4593-8c61-61261433a97f'; // Replace with an actual mentor key
    const title = 'Math Assignment 1'; // Homework title
    const description = 'Complete the exercises from chapter 3 and submit by the due date.'; // Homework description
    const assignedDate = '2024-11-10'; // Date when the homework is assigned (YYYY-MM-DD)
    const dueDate = '2024-11-17'; // Due date for the homework (YYYY-MM-DD)

    try {
        const homeworkId = await createHomework(menteeKey, mentorKey, title, description, assignedDate, dueDate);
        console.log(`Homework created successfully with ID: ${homeworkId}`);
    } catch (error) {
        console.error('Failed to create homework:', error);
    }
};

// Call the example insert function
insertHomeworkExample();*/
