const pool = require('../config/dbConfig');

class Department {
  static async addDepartment(name) {
    const [result] = await pool.query('INSERT INTO department (name) VALUES (?)', [name]);
    return result.insertId;
  }

  static async viewDepartments() {
    const [departments] = await pool.query('SELECT * FROM department');
    return departments;
  }

  static async getDepartmentById(departmentId) {
    const [departments] = await pool.query('SELECT * FROM department WHERE id = ?', [departmentId]);
    return departments[0];
  }

  static async removeDepartment(departmentId) {
    // Check if any employees are associated with the department before attempting to delete
    const [employees] = await pool.query('SELECT * FROM employee WHERE department_id = ?', [departmentId]);
    if (employees.length > 0) {
      throw new Error('Department has employees assigned and cannot be deleted');
    }
    const [result] = await pool.query('DELETE FROM department WHERE id = ?', [departmentId]);
    return result.affectedRows;
  }

  static async updateDepartment(departmentId, newName) {
    const [result] = await pool.query('UPDATE department SET name = ? WHERE id = ?', [newName, departmentId]);
    return result.affectedRows;
  }

  // Additional methods as needed...
}

module.exports = Department;
