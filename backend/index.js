
import express from 'express';
import pool from './database.js'; 
import bcrpytjs from 'bcryptjs';

const app = express();

// Test the database connection on server startup
pool.getConnection();

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});