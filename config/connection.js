require('dotenv').config();
const mysql = require('mysql2');

// Database configuration using environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Create a connection pool to the database
const pool = mysql.createPool(dbConfig);

pool.getConnection((error, connection) => {
  if (error) {
    console.error('Error connecting to the database:', error);
    // Consider adding retry logic here
    return;
  }
  console.log('Successfully connected to the database.');
  connection.release();
});

module.exports = pool;
