const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'B30wulf7',
  database: 'empl0yee_tr4cker_db',
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
        console.log('Query executed successfully');
        callback(null, results);
      }
    });
  },
  // Close the database connection when done
  close: () => {
    connection.end();
    console.log('Connection to MySQL closed');
  },
};
