const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'B30wulf7',
  database: 'empl0yee_tr4cker_db',
};

const pool = mysql.createPool(dbConfig);

const connect = async () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
};

const close = (connection) => {
  return new Promise((resolve, reject) => {
    connection.release();
    resolve();
  });
};

// Function to reset the database
const resetDatabase = async () => {
  const connection = await connect();
  
  // Define SQL queries to clear or reinitialize tables
  const clearTableQueries = [
    'DELETE FROM employees', // Clear the 'employees' table
    // Add more queries for other tables as needed
  ];

  try {
    // Execute SQL queries to clear tables
    for (const query of clearTableQueries) {
      await executeQuery(connection, query);
    }

    // Optionally, you can add code here to reinitialize data if needed

    // Close the connection after resetting the database
    await close(connection);
  } catch (error) {
    console.error('Error resetting the database:', error);
  }
};

// Helper function to execute SQL queries
const executeQuery = (connection, query) => {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  connect,
  close,
  resetDatabase, // Export the resetDatabase function
  // Other exports if needed
};
