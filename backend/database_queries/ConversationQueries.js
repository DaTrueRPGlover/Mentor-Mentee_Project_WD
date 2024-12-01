// database_queries/ConversationQueries.js
import { pool } from '../database.js';

export const getMessagesByMentorAndMentee = async (mentorkey, menteekey) => {
  console.log('getMessagesByMentorAndMentee called with', mentorkey, menteekey);

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
      c.mentor_id = ? AND c.mentee_id = ?
    ORDER BY 
      m.timestamp;
  `;
  const [rows] = await pool.execute(sql, [mentorkey, menteekey]);
  console.log('Messages retrieved:', rows);
  return rows;
};

export const createCheckConversationKey = async (menteekey, mentorkey) => {
  console.log('createCheckConversationKey called with', menteekey, mentorkey);

  const checkSql = `SELECT conversation_key FROM conversations WHERE mentor_id = ? AND mentee_id = ?`;
  const insertSql = `INSERT INTO conversations (conversation_key, mentor_id, mentee_id, created_at) VALUES (UUID(), ?, ?, NOW())`;

  const [rows] = await pool.execute(checkSql, [mentorkey, menteekey]);
  if (rows.length === 0) {
    await pool.execute(insertSql, [mentorkey, menteekey]);
    console.log('Inserted new conversation');

    // Retrieve the new conversation key
    const [newRows] = await pool.execute(checkSql, [mentorkey, menteekey]);
    console.log('New conversation key:', newRows[0].conversation_key);
    return newRows[0].conversation_key;
  } else {
    console.log('Conversation already exists:', rows[0].conversation_key);
    return rows[0].conversation_key;
  }
};

export const insertMessage = async (conversationKey, senderRole, messageText) => {
  console.log('insertMessage called with', conversationKey, senderRole, messageText);

  const sql = `
    INSERT INTO messages (conversation_key, sender_role, message_text, timestamp) 
    VALUES (?, ?, ?, NOW())
  `;
  const [result] = await pool.execute(sql, [conversationKey, senderRole, messageText]);
  console.log('Message inserted with ID:', result.insertId);
  return result.insertId;
};

// Here is the implementation of getMessagesByConversationKey
export const getMessagesByConversationKey = async (conversationKey) => {
  console.log('getMessagesByConversationKey called with', conversationKey);

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
      timestamp;
  `;
  const [rows] = await pool.execute(sql, [conversationKey]);
  console.log('Messages retrieved:', rows);
  return rows;
};
