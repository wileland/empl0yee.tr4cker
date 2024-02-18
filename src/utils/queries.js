import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const executeQuery = async (query, params = []) => {
  try {
    const [results] = await pool.query(query, params);
    return results;
  } catch (error) {
    console.error('Error executing query:', error.message);
    throw error;
  }
};

export const db = {
  select: executeQuery,
  execute: executeQuery,
  addDepartment: async (name) => {
    const query = 'INSERT INTO department (name) VALUES (?)';
    const results = await executeQuery(query, [name]);
    return results.insertId;
  },
  addRole: async (title, salary, departmentId) => {
    const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    const results = await executeQuery(query, [title, salary, departmentId]);
    return results.insertId;
  },
  addEmployee: async (firstName, lastName, roleId, managerId) => {
    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    const results = await executeQuery(query, [firstName, lastName, roleId, managerId]);
    return results.insertId;
  },
  updateEmployeeRole: async (employeeId, roleId) => {
    const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
    const results = await executeQuery(query, [roleId, employeeId]);
    return results.affectedRows > 0;
  },
  deleteEmployee: async (employeeId) => {
    const query = 'DELETE FROM employee WHERE id = ?';
    const results = await executeQuery(query, [employeeId]);
    return results.affectedRows > 0;
  },
  updateEmployeeDetails: async (employeeId, firstName, lastName, managerId) => {
    const query = 'UPDATE employee SET first_name = ?, last_name = ?, manager_id = ? WHERE id = ?';
    const results = await executeQuery(query, [firstName, lastName, managerId, employeeId]);
    return results.affectedRows > 0;
  },
  close: async () => {
    await pool.end();
  }
};
