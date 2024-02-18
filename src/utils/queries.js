import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
import inquirer from 'inquirer';

dotenv.config();

const pool = createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const executeQuery = async (query, params = []) => {
  try {
    const [results] = await pool.query(query, params);
    return results;
  } catch (error) {
    console.error(`Error executing query: ${error.message}`);
    throw error;
  }
};

export const db = {
  select: async (query, params) => executeQuery(query, params),

  execute: async (query, params) => executeQuery(query, params),

  addDepartment: async (name) => {
    try {
      if (!name) {
        throw new Error('Department name cannot be null');
      }

      const query = 'INSERT INTO department (name) VALUES (?)';
      const results = await executeQuery(query, [name]);
      console.log('Department added successfully!');
      return results.insertId;
    } catch (error) {
      console.error('Error adding department:', error);
    }
  },

  addRole: async (title, salary, departmentId) => {
    try {
      const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
      const results = await executeQuery(query, [title, salary, departmentId]);
      console.log('Role added successfully!');
      return results.insertId;
    } catch (error) {
      console.error('Error adding role:', error);
    }
  },

  addEmployee: async () => {
    try {
      const { employeeDetails } = await inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: "What is the employee's first name? (Type 'b' to go back)",
          validate: (input) => {
            return input.toLowerCase() === 'b' || input.trim() !== '' || "Please enter the employee's first name or type 'b' to go back.";
          },
        },
        {
          type: 'input',
          name: 'lastName',
          message: "What is the employee's last name? (Type 'b' to go back)",
          validate: (input) => {
            return input.toLowerCase() === 'b' || input.trim() !== '' || "Please enter the employee's last name or type 'b' to go back.";
          },
        },
        {
          type: 'list',
          name: 'roleId',
          message: "What is the employee's role? (Type 'b' to go back)",
          choices: await getRolesForChoices(),
        },
        {
          type: 'list',
          name: 'managerId',
          message: "Who is the employee's manager? (Type 'b' to go back)",
          choices: await getEmployeesForChoices(),
        },
      ]);

      if (Object.values(employeeDetails).some(val => val.toLowerCase() === 'b')) return; // If any value is "b", return without adding employee

      const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
      const results = await executeQuery(query, [employeeDetails.firstName, employeeDetails.lastName, employeeDetails.roleId, employeeDetails.managerId]);
      console.log('Employee added successfully!');
      return results.insertId;
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  },

  updateEmployeeDetails: async () => {
    try {
      const employeeId = await inquirer.prompt({
        type: 'input',
        name: 'employeeId',
        message: 'Enter the ID of the employee you want to update: (Type "b" to go back)',
        validate: (input) => {
          return input.toLowerCase() === 'b' || !isNaN(input) || 'Please enter a valid employee ID or type "b" to go back.';
        },
      });

      if (employeeId.toLowerCase() === 'b') return; // If user types "b", return without updating employee

      const { firstName, lastName, managerId } = await inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: "What is the employee's first name? (Type 'b' to go back)",
          validate: (input) => {
            return input.toLowerCase() === 'b' || input.trim() !== '' || "Please enter the employee's first name or type 'b' to go back.";
          },
        },
        {
          type: 'input',
          name: 'lastName',
          message: "What is the employee's last name? (Type 'b' to go back)",
          validate: (input) => {
            return input.toLowerCase() === 'b' || input.trim() !== '' || "Please enter the employee's last name or type 'b' to go back.";
          },
        },
        {
          type: 'input',
          name: 'managerId',
          message: "Who is the employee's manager? (Type 'b' to go back)",
          validate: (input) => {
            return input.toLowerCase() === 'b' || !isNaN(input) || "Please enter a valid manager ID or type 'b' to go back.";
          },
        },
      ]);

      if (Object.values({ firstName, lastName, managerId }).some(val => val.toLowerCase() === 'b')) return; // If any value is "b", return without updating employee

      const query = 'UPDATE employee SET first_name = ?, last_name = ?, manager_id = ? WHERE id = ?';
      const results = await executeQuery(query, [firstName, lastName, managerId, employeeId]);
      console.log('Employee details updated successfully!');
      return results.affectedRows > 0;
    } catch (error) {
      console.error('Error updating employee details:', error);
    }
  },
};

export const getRolesForChoices = async () => {
  try {
    const roles = await db.select('SELECT id, title FROM role');
    return roles.map(role => ({
      name: role.title,
      value: role.id,
    }));
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

export const getEmployeesForChoices = async () => {
  try {
    const employees = await db.select('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee');
    return employees.map(employee => ({
      name: employee.full_name,
      value: employee.id,
    }));
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};

export const closePool = async () => {
  try {
    await pool.end();
    console.log('Database connection pool closed.');
  } catch (error) {
    console.error('Error closing the database pool:', error.message);
  }
};
