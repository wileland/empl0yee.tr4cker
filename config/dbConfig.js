const mysql = require('mysql2/promise'); // Use 'mysql2/promise' for async/await support

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'B30wulf7',
  database: 'empl0yee_tr4cker_db',
};

// Function to create a database connection pool
const createPool = () => {
  return mysql.createPool(dbConfig);
};

// Function to get a connection from the pool
const getConnection = async () => {
  const pool = createPool();
  return pool.getConnection();
};

// Function to close a connection
const closeConnection = (connection) => {
  connection.release();
};

// Function to reset the database
const resetDatabase = async () => {
  const connection = await getConnection();
  
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
    closeConnection(connection);
  } catch (error) {
    console.error('Error resetting the database:', error);
  }
};

// Helper function to execute SQL queries
const executeQuery = async (connection, query) => {
  try {
    const [results] = await connection.query(query);
    return results;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getConnection,
  closeConnection,
  resetDatabase,
  // Add other exports if needed
};
