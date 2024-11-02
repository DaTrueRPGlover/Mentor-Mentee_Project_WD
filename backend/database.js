import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'wdcdb.ct8mmwauelso.us-east-2.rds.amazonaws.com', //This is the place hosting our DB
    user: 'root',
    password: 'wdctest309',
    database: 'wdctables'
}).promise();