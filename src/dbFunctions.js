// dbFunctions.js
import { db } from './queries.js'; // Import required functions from queries.js

const viewDepartments = async () => {
  try {
    const departments = await db.select('SELECT * FROM department ORDER BY id');
    console.table(departments);
  } catch (error) {
    console.error(`Error viewing departments: ${error.message}`);
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
    const roles = await db.select(query);
    console.table(roles);
  } catch (error) {
    console.error(`Error viewing roles: ${error.message}`);
  }
};

// Define other functions similarly using the `db` object from queries.js

export {
  viewDepartments,
  viewRoles,
  // Export other functions here...
};
