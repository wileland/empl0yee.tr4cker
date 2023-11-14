// dbConfig.js

const mysql = require('mysql2/promise');

// Database configuration using environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Exports for other database functions
const insert = async (connection, table, data) => {
  const [results, fields] = await connection.query(`INSERT INTO ${table} SET ?`, data);
  return results.insertId;
};

const update = async (connection, table, data, where) => {
  const [results, fields] = await connection.query(`UPDATE ${table} SET ? WHERE ?`, [data, where]);
  return results.affectedRows;
};

const delete = async (connection, table, where) => {
  const [results, fields] = await connection.query(`DELETE FROM ${table} WHERE ?`, where);
  return results.affectedRows;
};

module.exports = {
  dbConfig,
  getConnection,
  insert,
  update,
  delete,
};