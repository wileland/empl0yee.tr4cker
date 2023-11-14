const mysql = require('mysql2');

// Create a connection pool to the database
const pool = mysql.createPool(dbConfig);
  host: 'localhost',      // Replace with your actual database host
  user: 'root',           // Replace with your actual database user
  password: 'B30wulf7',  // Replace with your actual database password
  database: 'empl0yee_tr4cker_db'  // Replace with your actual database name
});

// Open the MySQL connection pool
pool.getConnection((error, connection) => {
  if (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
  console.log("Successfully connected to the empl0yee_tr4cker_database.");

  // Release the connection back to the pool when done with it
  connection.release();
});

module.exports = pool;
