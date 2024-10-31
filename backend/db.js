// db.js
const mysql = require('mysql2/promise');

// Use environment variables or a config file to store sensitive information
const dbConfig = {
  host: 'wdcdb.ct8mmwauelso.us-east-2.rds.amazonaws.com',
  user: 'root',
  password: 'wdctest309',
  database: 'wdctables',
};

async function initialize() {
  const connection = await mysql.createConnection(dbConfig);
  console.log('Connected to MySQL database.');
  return connection;
}

module.exports = initialize;