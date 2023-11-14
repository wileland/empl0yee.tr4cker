const { pool } = require('../config/dbConfig');

class Employee {
  static async getEmployees() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM employee');
      return rows;
    } finally {
      connection.release();
    }
  }

  static async addEmployee(firstName, lastName, roleId, managerId = null) {
    const connection = await pool.getConnection();
    try {
      const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
      const [result] = await connection.query(query, [firstName, lastName, roleId, managerId]);
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async getEmployeeById(id) {
    const connection = await pool.getConnection();
    try {
      const query = `SELECT * FROM employee WHERE id = ?`;
      const [rows] = await connection.query(query, [id]);
      return rows[0];
    } finally {
      connection.release();
    }
  }

  static async updateEmployeeRole(employeeId, newRoleId) {
    const connection = await pool.getConnection();
    try {
      // Check if the role exists
      const [roles] = await connection.query('SELECT * FROM role WHERE id = ?', [newRoleId]);
      if (roles.length === 0) {
        throw new Error('Role ID does not exist');
      }

      // Perform the update
      const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
      const [result] = await connection.query(query, [newRoleId, employeeId]);
      return result.affectedRows;
    } finally {
      connection.release();
    }
  }

  static async deleteEmployee(id) {
    const connection = await pool.getConnection();
    try {
      const query = `DELETE FROM employee WHERE id = ?`;
      const [result] = await connection.query(query,
        const { pool } = require('../config/dbConfig');

        class Employee {
          // ... Other static methods ...
        
          static async deleteEmployee(id) {
            const connection = await pool.getConnection();
            try {
              // Check if the employee is a manager for other employees before deleting
              const [managedEmployees] = await connection.query('SELECT * FROM employee WHERE manager_id = ?', [id]);
              if (managedEmployees.length > 0) {
                throw new Error('Cannot delete employee who is a manager.');
              }
        
              // Perform the delete
              const query = `DELETE FROM employee WHERE id = ?`;
              const [result] = await connection.query(query, [id]);
              return result.affectedRows;
            } finally {
              connection.release();
            }
          }
        }
        
        module.exports = Employee;
        