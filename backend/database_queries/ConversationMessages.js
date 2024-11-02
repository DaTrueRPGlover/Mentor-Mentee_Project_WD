//insert into conversations values(1, 10, 10, NOW());
/*INSERT INTO messages (conversation_key, sender_role, message_text, timestamp)
VALUES (1, 'mentor', 'This is a test message', NOW());*/
//insert into messages values(null,'1', 'mentor', 'This is a test message', NOW());
//insert into conversations values (UUID(), 11, 10, NOW());

import { pool } from '../database.js';

export const getMessagesByMenteeKey = async (menteekey) => { //Gets all the messages from a mentee using the menteekey, we might want to implement only getting the ones for a specific conversation
    const sql = `
    SELECT 
        c.conversation_key,
        c.mentor_id,
        c.mentee_id,
        c.created_at AS conversation_start,
        m.message_id,
        m.sender_role,
        m.message_text,
        m.timestamp AS message_time
    FROM 
        conversations AS c
    LEFT JOIN 
        messages AS m ON c.conversation_key = m.conversation_key
    WHERE 
        c.mentee_id = ?
    ORDER BY 
        c.conversation_key, m.timestamp;
    `;
    
    try {
        const [rows] = await pool.execute(sql, [menteekey]);
        return rows;
    } catch (error) {
        console.error('Error fetching messages by mentee key:', error);
        throw error;
    }
};

export const getMessagesByMentorKey = async (mentorkey) => {
    const sql = `
    SELECT 
        c.conversation_key,
        c.mentor_id,
        c.mentee_id,
        c.created_at AS conversation_start,
        m.message_id,
        m.sender_role,
        m.message_text,
        m.timestamp AS message_time
    FROM 
        conversations AS c
    LEFT JOIN 
        messages AS m ON c.conversation_key = m.conversation_key
    WHERE 
        c.mentor_id = ?
    ORDER BY 
        c.conversation_key, m.timestamp;
    `;
    
    try {
        const [rows] = await pool.execute(sql, [mentorkey]);
        return rows;
    } catch (error) {
        console.error('Error fetching messages by mentor key:', error);
        throw error;
    }
};

export const createCheckConversationKey = async (menteekey, mentorkey) => {
    const checkSql = `SELECT conversation_key FROM conversations WHERE mentorkey = ? AND menteekey = ?`; //Check whether there is already an entry for conversations (if a chat has already been created)
    const insertSql = `INSERT INTO conversations (conversation_key, mentorkey, menteekey, created_at) VALUES (UUID(), ?, ?, NOW())`; //If not, we will make one
    
    try {
        const [rows] = await pool.execute(checkSql, [mentorkey, menteekey]);//Execute the check
        
        if (rows.length === 0) {//If there is no conversation initiated
            const [result] = await pool.execute(insertSql, [mentorkey, menteekey]);
            return result.insertId; //Retrieve the newly created conversation_key
        } else {
            return rows[0].conversation_key; //If it already existed, we return the conversation_key it had
        }
    } catch (error) {
        console.error('Error ensuring conversation exists:', error);
        throw error;
    }
};

export const insertMessage = async (conversationKey, senderRole, messageText) => {
    const sql = `
    INSERT INTO messages (conversation_key, sender_role, message_text, timestamp) 
    VALUES (?, ?, ?, NOW())
    `;
    
    try {
        const [result] = await pool.execute(sql, [conversationKey, senderRole, messageText]);
        console.log('Message inserted with ID:', result.insertId);
        return result.insertId; // Return the ID of the newly inserted message
    } catch (error) {
        console.error('Error inserting message:', error);
        throw error;
    }
};

export const getRecentConversationsByMentorKey = async (mentorkey, limit = 10) => {//This function will retrieve the conversations that a mentor has had
    const sql = `
    SELECT 
        conversation_key,
        mentorkey,
        menteekey,
        created_at
    FROM 
        conversations
    WHERE 
        mentorkey = ?
    ORDER BY 
        created_at DESC;
    LIMIT ?;
    `;
    
    try {
        const [rows] = await pool.execute(sql, [mentorkey, limit]);
        return rows; // Return all matching conversations for the mentor
    } catch (error) {
        console.error('Error retrieving recent conversations:', error);
        throw error;
    }
};

export const getRecentConversationsByMenteeKey = async (menteekey, limit = 10) => {//This function shouldn't be needed but in case there is a change in mentor we should use it so we can still access previous conversations
    const sql = `
    SELECT 
        conversation_key,
        mentorkey,
        menteekey,
        created_at
    FROM 
        conversations
    WHERE 
        menteekey = ?
    ORDER BY 
        created_at DESC
    LIMIT ?;
    `;
    
    try {
        const [rows] = await pool.execute(sql, [menteekey, limit]);
        return rows; // Return the mentee's recent conversations
    } catch (error) {
        console.error('Error retrieving recent conversations for mentee:', error);
        throw error;
    }
};

export const getLatestMessagesByConversationKey = async (conversationKey, limit = 20) => {//Retrieve the latest messages given a conversation_key, defaults to 20 latest messages but can be set. Default call is getLatestMessagesByConversationKey(conversation_key)
    const sql = `
    SELECT 
        message_id,
        sender_role,
        message_text,
        timestamp AS message_time
    FROM 
        messages
    WHERE 
        conversation_key = ?
    ORDER BY 
        timestamp DESC
    LIMIT ?;
    `;
    
    try {
        const [rows] = await pool.execute(sql, [conversationKey, limit]);
        return rows.reverse(); // Reverse to display from oldest to newest
    } catch (error) {
        console.error('Error retrieving latest messages:', error);
        throw error;
    }
};





const MenteeMessages = await getMessagesByMenteeKey('10'); 
const MentorMessages = await getMessagesByMentorKey('10');
//Displaying all the data
//console.log('Messages (Mentee Perspective):', MenteeMessages);
//console.log('Messages (Mentor Perspective):', MentorMessages);

//Displaying only the message_text and the message_time
MenteeMessages.forEach(({ conversation_key, message_text, message_time }) => {
    console.log(`MENTEE Conversation ${conversation_key} - Message: ${message_text}, Timestamp: ${message_time}`);
});

MentorMessages.forEach(({ conversation_key, message_text, message_time }) => {
    console.log(`MENTOR Conversation ${conversation_key} -Message: ${message_text}, Timestamp: ${message_time}`);
});