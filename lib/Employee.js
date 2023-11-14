// Employee.js
const { pool } = require('../config/dbConfig');

class Employee {
  static async getEmployees() {
    const [rows] = await pool.query('SELECT * FROM employee');
    return rows;
  }

  static async addEmployee(firstName, lastName, roleId, managerId = null) {
    const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.query(query, [firstName, lastName, roleId, managerId]);
    return result.insertId;
  }

  static async getEmployeeById(id) {
    const query = `SELECT * FROM employee WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async updateEmployee(id, firstName, lastName, roleId, managerId = null) {
    const query = `UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE id = ?`;
    const [result] = await pool.query(query, [firstName, lastName, roleId, managerId, id]);
    return result.affectedRows;
  }

  static async deleteEmployee(id) {
    const query = `DELETE FROM employee WHERE id = ?`;
    const [result] = await pool.query(query, [id]);
    return result.affectedRows;
  }
}

module.exports = Employee;
