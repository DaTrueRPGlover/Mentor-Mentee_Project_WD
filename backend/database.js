import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool.getConnection()
    .then((connection) => {
        console.log('Connected to the database');
        connection.release(); // Release connection back to the pool
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });

    console.log('DB_HOST:', process.env.DB_HOST);

export default pool;
