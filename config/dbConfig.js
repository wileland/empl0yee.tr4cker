require('dotenv').config();
const mysql = require('mysql2/promise');

// Database configuration using environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Create a connection pool to the database
const pool = mysql.createPool(dbConfig);

// Establishes a database connection.
const connect = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database.');
    return connection;
  } catch (error) {
    throw new Error(`Error connecting to the database: ${error.message}`);
  }
};

// Closes a database connection.
const close = async (connection) => {
  if (connection) {
    try {
      await connection.release();
    } catch (error) {
      console.error(`Error releasing the connection: ${error.message}`);
    }
  }
};

// Resets the database (use with caution!).
const resetDatabase = async () => {
  // ... rest of the resetDatabase function ...
};

// Executes a SQL query on the database.
const executeQuery = async (connection, query) => {
  // ... rest of the executeQuery function ...
};

module.exports = {
  connect,
  close,
  resetDatabase,
  executeQuery,
  // ... other exports if needed ...
};
