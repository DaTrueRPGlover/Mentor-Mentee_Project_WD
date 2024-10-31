// models/userModel.js
const bcrypt = require('bcryptjs');

class UserModel {
  constructor(db) {
    this.db = db;
  }

  async getAllUsers() {
    const [rows] = await this.db.execute('SELECT * FROM userInfo');
    return rows;
  }

  async getUserById(userId) {
    const [rows] = await this.db.execute('SELECT * FROM userInfo WHERE id = ?', [userId]);
    return rows[0];
  }

  async createUser(userData) {
    const { name, email, password, role, department, username } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO userInfo (name, email, password, role, department, username)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [name, email, hashedPassword, role, department, username];
    const [result] = await this.db.execute(sql, params);
    console.log('Insert Result:', result);
    console.log('New User ID:', result.insertId);
    return result.insertId; // This should be the new user's ID
  }

  async getUserByEmail(email) {
    const sql = `
      SELECT 
        iduserInfo,
        name,
        email,
        password,
        role,
        department,
        username
      FROM userInfo WHERE email = ?`;
    const [rows] = await this.db.execute(sql, [email]);
    return rows[0];
  }


  async updateUser(userId, userData) {
    const { name, email, role, department } = userData;
    const sql = 'UPDATE userInfo SET name = ?, email = ?, role = ?, department = ? WHERE id = ?';
    const values = [name, email, role, department, userId];
    const [result] = await this.db.execute(sql, values);
    return result.affectedRows > 0;
  }

  async deleteUser(userId) {
    const [result] = await this.db.execute('DELETE FROM userInfo WHERE id = ?', [userId]);
    return result.affectedRows > 0;
  }
}

module.exports = UserModel;
