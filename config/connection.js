const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',      // Database host
  user: 'root',           // Database user
  password: 'B30wulf7',  // Database password
  database: 'empl0yee_tr4cker_db'  // Database name
});

// Open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the empl0yee_tr4cker_database.");
});

module.exports = connection;
