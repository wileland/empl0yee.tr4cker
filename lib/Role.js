// Role.js
const { pool } = require('../config/dbConfig');

class Role {
  constructor(pool) {
    this.pool = pool;
  }
const getRoles = async () => {
  const [rows] = await pool.query('SELECT * FROM role');
  return rows;
};

const addRole = async (title, salary, departmentId) => {
  const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
  const [result] = await pool.query(query, [title, salary, departmentId]);
  return result.insertId;
};

const getRoleById = async (id) => {
  const query = 'SELECT * FROM role WHERE id = ?';
  const [rows] = await pool.query(query, [id]);
  return rows[0];
};

const updateRole = async (id, title, salary, departmentId) => {
  const query = 'UPDATE role SET title = ?, salary = ?, department_id = ? WHERE id = ?';
  const [result] = await pool.query(query, [title, salary, departmentId, id]);
  return result.affectedRows;
};

const deleteRole = async (id) => {
  const query = 'DELETE FROM role WHERE id = ?';
  const [result] = await pool.query(query, [id]);
  return result.affectedRows;
};

module.exports = {
  getRoles,
  addRole,
  getRoleById,
  updateRole,
  deleteRole,
};
async addRole(title, salary, departmentId = null) {
  const query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
  const [result] = await this.pool.query(query, [title, salary, departmentId]);
  return result.insertId;
}

async close() {
  this.pool.releaseConnection();
}
}