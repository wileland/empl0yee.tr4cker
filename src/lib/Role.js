// Role.js
const pool = require('../config/dbConfig');

class Role {
  static async addRole(title, salary, departmentId) {
    // Add logic to ensure the department exists before adding a role
    const [department] = await pool.query('SELECT * FROM department WHERE id = ?', [departmentId]);
    if (!department.length) {
      throw new Error('Department not found');
    }

    const [result] = await pool.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
    return result.insertId; // Return the ID of the newly created role
  }

  static async getRoleById(roleId) {
    const [rows] = await pool.query('SELECT * FROM role WHERE id = ?', [roleId]);
    return rows[0]; // Return the role if found
  }

  static async updateRole(roleId, { title, salary, departmentId }) {
    // Optional: Add logic to validate the existence of the department if departmentId is updated
    const [result] = await pool.query('UPDATE role SET title = ?, salary = ?, department_id = ? WHERE id = ?', [title, salary, departmentId, roleId]);
    return result.affectedRows; // Return the number of affected rows
  }

  // ... additional methods like removeRole() as needed ...
}

module.exports = Role;
