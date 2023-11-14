const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'B30wulf7',
  database: 'empl0yee_tr4cker_db',
};


// Create a connection pool to the database
const pool = mysql.createPool(dbConfig);

/**
 * Establishes a database connection.
 * @returns {Promise<Connection>} A Promise that resolves to a database connection.
 */
const connect = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    throw new Error(`Error connecting to the database: ${error.message}`);
  }
};

/**
 * Closes a database connection.
 * @param {Connection} connection - The database connection to close.
 */
const close = (connection) => {
  return new Promise((resolve, reject) => {
    if (connection) {
      connection.release(); // Release the connection if it exists
    }
    resolve();
  });
};


/**
 * Resets the database by executing predefined SQL queries to clear or reinitialize tables.
 */
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
    close(connection);
  } catch (error) {
    console.error('Error resetting the database:', error.message);
  }
};

/**
 * Executes a SQL query on the database.
 * @param {Connection} connection - The database connection on which to execute the query.
 * @param {string} query - The SQL query to execute.
 * @returns {Promise<Array>} A Promise that resolves to the results of the query.
 */
const executeQuery = async (connection, query) => {
  try {
    const [results] = await connection.query(query);
    return results;
  } catch (error) {
    throw new Error(`Error executing SQL query: ${error.message}`);
  }
};

module.exports = {
  connect,
  close,
  resetDatabase,
  executeQuery,
  // Add other exports if needed
};
