const pool = require('../config/dbConfig');

class Employee {
  static async addEmployee(firstName, lastName, roleId, managerId = null) {
    // Check if the role and manager exist before adding an employee
    const [role] = await pool.query('SELECT * FROM role WHERE id = ?', [roleId]);
    const [manager] = await pool.query('SELECT * FROM employee WHERE id = ?', [managerId]);

    if (!role.length || !manager.length) {
      throw new Error('Role or manager not found');
    }

    // Insert the employee into the database
    const [result] = await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
    return result.insertId; // Return the ID of the newly created employee
  }

  static async getEmployeeById(employeeId) {
    // Retrieve an employee by their ID
    const [rows] = await pool.query('SELECT * FROM employee WHERE id = ?', [employeeId]);
    return rows[0]; // Return the employee if found
  }

  static async updateEmployee(employeeId, { firstName, lastName, roleId, managerId }) {
    // Optional: Add logic to validate the existence of the role and manager if roleId or managerId is updated
    const [result] = await pool.query('UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE id = ?', [firstName, lastName, roleId, managerId, employeeId]);
    return result.affectedRows; // Return the number of affected rows
  }

  static async removeEmployee(employeeId) {
    // Check if the employee is a manager for other employees before deleting
    const [managedEmployees] = await pool.query('SELECT * FROM employee WHERE manager_id = ?', [employeeId]);
    if (managedEmployees.length > 0) {
      throw new Error('Cannot delete employee who is a manager.');
    }

    // Perform the delete
    const [result] = await pool.query('DELETE FROM employee WHERE id = ?', [employeeId]);
    return result.affectedRows; // Return the number of affected rows
  }
}

module.exports = Employee;
