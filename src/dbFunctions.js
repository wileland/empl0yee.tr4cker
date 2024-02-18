import { pool } from './utils/queries';

const executeQuery = async (query, params = []) => {
  try {
    const [results] = await pool.query(query, params);
    return results;
  } catch (error) {
    console.error(`Error executing query: ${error.message}`);
    throw error;
  }
};

const viewDepartments = async () => {
  try {
    const [rows] = await executeQuery('SELECT * FROM department ORDER BY id');
    console.table(rows);
  } catch (error) {
    console.error(`Error viewing departments: ${error}`);
  }
};

const viewRoles = async () => {
  try {
    const query = `
      SELECT role.id, role.title, department.name AS department, role.salary 
      FROM role 
      INNER JOIN department ON role.department_id = department.id
      ORDER BY role.id
    `;
    const [rows] = await executeQuery(query);
    console.table(rows);
  } catch (error) {
    console.error(`Error viewing roles: ${error}`);
  }
};

// Define other functions similarly...

const closeConnection = () => {
  pool.end();
  console.log('Database pool closed.');
};

export {
  viewDepartments,
  viewRoles,
  // Export other functions here...
  closeConnection,
};
