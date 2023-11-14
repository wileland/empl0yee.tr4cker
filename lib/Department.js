const { pool } = require('../config/dbConfig');

class Department {
  static async getDepartments() {
    const [rows] = await pool.query('SELECT * FROM department');
    return rows;
  }

  static async addDepartment(name) {
    const query = 'INSERT INTO department (name) VALUES (?)';
    const [result] = await pool.query(query, [name]);
    return result.insertId;
  }

  static async getDepartmentById(id) {
    const query = 'SELECT * FROM department WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async updateDepartment(id, name) {
    const query = 'UPDATE department SET name = ? WHERE id = ?';
    const [result] = await pool.query(query, [name, id]);
    return result.affectedRows;
  }

  static async deleteDepartment(id) {
    const query = 'DELETE FROM department WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows;
  }
}

module.exports = Department;
