const mysql = require('mysql2/promise');

// Retry logic for connecting to the database
const getConnection = async () => {
  let connection;
  for (let i = 0; i < 3; i++) {
    try {
      connection = await
 
mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,

        
database: process.env.DB_NAME,
      });
      break;
    } catch (error) {
      console.error(`Error connecting to the database on attempt ${i + 1}: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  if (!connection) {
    throw new Error('Failed to connect to the database after 3 attempts.');
  }
  return connection;
};

module.exports = { getConnection };