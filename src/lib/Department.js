// Using ES6 import syntax (make sure to set "type": "module" in package.json or use .mjs extension)
import pool from '../config/dbConfig.js';

class Department {
  // Use arrow functions for static methods if you prefer
  static addDepartment = async (name) => {
    const [result] = await pool.query('INSERT INTO department (name) VALUES (?)', [name]);
    return result.insertId;
  }

  static viewDepartments = async () => {
    const [departments] = await pool.query('SELECT * FROM department');
    return departments;
  }

  static getDepartmentById = async (departmentId) => {
    const [departments] = await pool.query('SELECT * FROM department WHERE id = ?', [departmentId]);
    return departments[0];
  }

  static removeDepartment = async (departmentId) => {
    // Use a transaction to ensure data integrity during the delete operation
    await pool.beginTransaction();
    try {
      const [employees] = await pool.query('SELECT * FROM employee WHERE department_id = ?', [departmentId]);
      if (employees.length > 0) {
        throw new Error('Department has employees assigned and cannot be deleted');
      }

      const [result] = await pool.query('DELETE FROM department WHERE id = ?', [departmentId]);
      await pool.commit();
      return result.affectedRows;
    } catch (error) {
      await pool.rollback();
      throw error; // Rethrow the error after rolling back the transaction
    }
  }

  static updateDepartment = async (departmentId, newName) => {
    const [result] = await pool.query('UPDATE department SET name = ? WHERE id = ?', [newName, departmentId]);
    return result.affectedRows;
  }

  // Additional methods as needed...
}

// Using ES6 export syntax
export default Department;
