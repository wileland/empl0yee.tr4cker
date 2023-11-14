// Department.js
const { pool } = require('../config/dbConfig');

class Department {
  constructor(pool) {
    this.pool = pool;
  }
const getDepartments = async () => {
  const [rows] = await pool.query('SELECT * FROM department');
  return rows;
};

const addDepartment = async (name) => {
  const query = 'INSERT INTO department (name) VALUES (?)';
  const [result] = await pool.query(query, [name]);
  return result.insertId;
};

const getDepartmentById = async (id) => {
  const query = 'SELECT * FROM department WHERE id = ?';
  const [rows] = await pool.query(query, [id]);
  return rows[0];
};

const updateDepartment = async (id, name) => {
  const query = 'UPDATE department SET name = ? WHERE id = ?';
  const [result] = await pool.query(query, [name, id]);
  return result.affectedRows;
};

const deleteDepartment = async (id) => {
  const query = 'DELETE FROM department WHERE id = ?';
  const [result] = await pool.query(query, [id]);
  return result.affectedRows;
};

module.exports = {
  getDepartments,
  addDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
async close() {
  this.pool.releaseConnection();
}
}