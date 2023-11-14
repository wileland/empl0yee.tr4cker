const mysql = require('mysql');
require('dotenv').config();
const db = require('./queries');

// Example usage
async function viewDepartments() {
  try {
    const departments = await db.select('SELECT * FROM department ORDER BY id', []);
    console.table(departments);
  } catch (error) {
    console.error('Error viewing departments:', error);
  }
}

// Call the function
viewDepartments();


// Create a connection pool to the MySQL database using the environment variables
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the limit as needed
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Function for executing a SQL query with error handling
const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  // Function for executing a SELECT query
  select: async (query, params) => {
    try {
      const results = await executeQuery(query, params);
      return results;
    } catch (error) {
      throw error;
    }
  },

  // Function for executing an INSERT, UPDATE, or DELETE query
  execute: async (query, params) => {
    try {
      const results = await executeQuery(query, params);
      return results;
    } catch (error) {
      throw error;
    }
  },

  // Function for adding a new department
  addDepartment: async (name) => {
    const query = 'INSERT INTO department (name) VALUES (?)';
    const params = [name];

    try {
      const results = await executeQuery(query, params);
      return results.insertId; // Return the ID of the newly inserted department
    } catch (error) {
      throw error;
    }
  },

  // Function for adding a new role
  addRole: async (title, salary, departmentId) => {
    const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    const params = [title, salary, departmentId];

    try {
      const results = await executeQuery(query, params);
      return results.insertId; // Return the ID of the newly inserted role
    } catch (error) {
      throw error;
    }
  },

  // Function for adding a new employee
  addEmployee: async (firstName, lastName, roleId, managerId) => {
    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    const params = [firstName, lastName, roleId, managerId];

    try {
      const results = await executeQuery(query, params);
      return results.insertId; // Return the ID of the newly inserted employee
    } catch (error) {
      throw error;
    }
  },

  // Function for updating an employee's role
  updateEmployeeRole: async (employeeId, roleId) => {
    const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
    const params = [roleId, employeeId];

    try {
      const results = await executeQuery(query, params);
      return results.affectedRows > 0; // Return true if the update was successful
    } catch (error) {
      throw error;
    }
  },

  // Function for deleting an employee
  deleteEmployee: async (employeeId) => {
    const query = 'DELETE FROM employee WHERE id = ?';
    const params = [employeeId];

    try {
      const results = await executeQuery(query, params);
      return results.affectedRows > 0; // Return true if the delete was successful
    } catch (error) {
      throw error;
    }
  },

  // Function for updating an employee's details (first name, last name, or manager)
  updateEmployeeDetails: async (employeeId, firstName, lastName, managerId) => {
    const query = 'UPDATE employee SET first_name = ?, last_name = ?, manager_id = ? WHERE id = ?';
    const params = [firstName, lastName, managerId, employeeId];

    try {
      const results = await executeQuery(query, params);
      return results.affectedRows > 0; // Return true if the update was successful
    } catch (error) {
      throw error;
    }
  },

  // Function to close the database connection pool when done
  close: () => {
    pool.end((err) => {
      if (err) {
        console.error('Error closing the database connection:', err);
      } else {
        console.log('Connection to MySQL closed');
      }
    });
  },
};
