// Import the pool using ES6 import syntax
import pool from '../config/dbConfig.js';

class Role {
  static addRole = async (title, salary, departmentId) => {
    // Ensure the department exists before adding a role
    const [department] = await pool.query('SELECT * FROM department WHERE id = ?', [departmentId]);
    if (department.length === 0) {
      throw new Error('Department not found');
    }

    const [result] = await pool.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
    return result.insertId;
  }

  static getRoleById = async (roleId) => {
    const [rows] = await pool.query('SELECT * FROM role WHERE id = ?', [roleId]);
    if (rows.length === 0) throw new Error('Role not found');
    return rows[0];
  }

  static updateRole = async (roleId, { title, salary, departmentId }) => {
    // Validate the existence of the department if departmentId is updated
    if (departmentId) {
      const [department] = await pool.query('SELECT * FROM department WHERE id = ?', [departmentId]);
      if (department.length === 0) {
        throw new Error('Department not found');
      }
    }

    const [result] = await pool.query('UPDATE role SET title = ?, salary = ?, department_id = ? WHERE id = ?', [title, salary, departmentId, roleId]);
    if (result.affectedRows === 0) throw new Error('Role not found or no update made');
    return result.affectedRows;
  }

  // Additional methods can be added here following the same pattern
}

// Export the Role class using ES6 export syntax
export default Role;
