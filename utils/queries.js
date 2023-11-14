const mysql = require('mysql');
require('dotenv').config();

// Create a connection to the MySQL database using the environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Export functions for executing queries
module.exports = {
  // Function for executing a SELECT query
  select: (query, params, callback) => {
    connection.query(query, params, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },

  // Function for executing an INSERT, UPDATE, or DELETE query
  execute: (query, params, callback) => {
    connection.query(query, params, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },

  // Function for executing a prepared statement
  prepare: (query, params, callback) => {
    // Create a prepared statement
    const stmt = connection.prepare(query);

    // Bind the parameters to the prepared statement
    stmt.bind(params);

    // Execute the prepared statement
    stmt.execute((err, results) => {
      // Close the prepared statement
      stmt.close();

      if (err) {
        console.error('Error executing prepared statement:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },

  // Function for getting the last inserted ID
  getLastInsertedId: () => {
    // Get the last inserted ID
    const lastInsertedId = connection.lastInsertId();

    // Return the last inserted ID
    return lastInsertedId;
  },

  // Close the database connection when done
  close: () => {
    connection.end();
    console.log('Connection to MySQL closed');
  },
};