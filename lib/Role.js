// Role.js
const { pool } = require('../config/dbConfig');

class Role {
  static async getRoles() {
    const [rows] = await pool.query('SELECT * FROM role');
    return rows;
  }

  static async addRole(title, salary, departmentId) {
    const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [title, salary, departmentId]);
    return result.insertId;
  }

  static async getRoleById(id) {
    const query = 'SELECT * FROM role WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async updateRole(id, title, salary, departmentId) {
    const query = 'UPDATE role SET title = ?, salary = ?, department_id = ? WHERE id = ?';
    const [result] = await pool.query(query, [title, salary, departmentId, id]);
    return result.affectedRows;
  }

  static async deleteRole(id) {
    const query = 'DELETE FROM role WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows;
  }
}

module.exports = Role;
