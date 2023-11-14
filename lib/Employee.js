const { pool } = require('../config/dbConfig');

const getEmployees = async () => {
  const [rows] = await pool.query('SELECT * FROM employee');
  return rows;
};

const addEmployee = async (firstName, lastName, roleId, managerId = null) => {
  const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
  const [result] = await pool.query(query, [firstName, lastName, roleId, managerId]);
  return result.insertId;
};

const getEmployeeById = async (id) => {
  const query = `SELECT * FROM employee WHERE id = ?`;
  const [rows] = await pool.query(query, [id]);
  return rows[0];
};

const updateEmployee = async (id, firstName, lastName, roleId, managerId = null) => {
  const query = `UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE id = ?`;
  const [result] = await pool.query(query, [firstName, lastName, roleId, managerId, id]);
  return result.affectedRows;
};

const deleteEmployee = async (id) => {
  const query = `DELETE FROM employee WHERE id = ?`;
  const [result] = await pool.query(query, [id]);
  return result.affectedRows;
};

module.exports = {
  getEmployees,
  addEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
