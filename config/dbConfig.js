const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration using environment variables for the connection pool.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// A function to get a connection from the pool
const getConnection = async () => {
  return await pool.getConnection();
};

// Exports for other database functions, using the pool to perform queries
const insert = async (table, data) => {
  const [results] = await pool.query(`INSERT INTO ${table} SET ?`, data);
  return results.insertId;
};

const update = async (table, data, where) => {
  const [results] = await pool.query(`UPDATE ${table} SET ? WHERE ?`, [data, where]);
  return results.affectedRows;
};

const deleteRow = async (table, where) => {
  const [results] = await pool.query(`DELETE FROM ${table} WHERE ?`, where);
  return results.affectedRows;
};

module.exports = {
  getConnection, // Use this function to get a connection from the pool
  insert,
  update,
  delete: deleteRow, // Renamed to avoid naming conflict with the delete keyword
};
