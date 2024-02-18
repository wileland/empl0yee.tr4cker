// queries.js
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool for the MySQL database
const pool = createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// A utility function to execute SQL queries with prepared statements
const executeQuery = async (query, params = []) => {
  try {
    const [results] = await pool.query(query, params);
    return results;
  } catch (error) {
    console.error(`Error executing query: ${error.message}`);
    throw error; // Re-throw the error to be handled by the caller
  }
};

// The db object contains methods for interacting with the database
export const db = {
  // A method to perform select operations
  select: async (query, params) => executeQuery(query, params),

  // A method to perform insert, update, delete operations
  execute: async (query, params) => executeQuery(query, params),

  // A method to add a new department
  addDepartment: async (name) => {
    const query = 'INSERT INTO department (name) VALUES (?)';
    const results = await executeQuery(query, [name]);
    return results.insertId;
  },

  // A method to add a new role
  addRole: async (title, salary, departmentId) => {
    const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    const results = await executeQuery(query, [title, salary, departmentId]);
    return results.insertId;
  },

  // A method to add a new employee
  addEmployee: async (firstName, lastName, roleId, managerId) => {
    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    const results = await executeQuery(query, [firstName, lastName, roleId, managerId]);
    return results.insertId;
  },

  // A method to update an employee's role
  updateEmployeeRole: async (employeeId, roleId) => {
    const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
    const results = await executeQuery(query, [roleId, employeeId]);
    return results.affectedRows > 0;
  },

  // A method to delete an employee
  deleteEmployee: async (employeeId) => {
    const query = 'DELETE FROM employee WHERE id = ?';
    const results = await executeQuery(query, [employeeId]);
    return results.affectedRows > 0;
  },

  // A method to update an employee's details
  updateEmployeeDetails: async (employeeId, firstName, lastName, managerId) => {
    const query = 'UPDATE employee SET first_name = ?, last_name = ?, manager_id = ? WHERE id = ?';
    const results = await executeQuery(query, [firstName, lastName, managerId, employeeId]);
    return results.affectedRows > 0;
  },
};

// Export the close function to close the database connection pool
export const closePool = async () => {
  try {
    await pool.end();
    console.log('Database connection pool closed.');
  } catch (error) {
    console.error('Error closing the database pool:', error.message);
  }
};
