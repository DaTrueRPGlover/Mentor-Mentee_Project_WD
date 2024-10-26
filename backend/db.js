
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Wdcslaves@4',
  database: 'wdc_test'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

module.exports = connection;


