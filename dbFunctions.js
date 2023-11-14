const mysql = require('mysql2');


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


// Function to obtain a database connection
async function getConnection() {
  return pool.promise().getConnection();
}

// Function to view departments
async function viewDepartments(connection) {
  try {
    const [rows] = await connection.query('SELECT * FROM department ORDER BY id');
    console.table(rows);
  } catch (error) {
    console.error('Error viewing departments:', error);
  } finally {
    connection.release(); // Release the connection back to the pool
  }
}

// Function to view roles
async function viewRoles(connection) {
  try {
    const query = `
      SELECT role.id, role.title, department.name AS department, role.salary 
      FROM role 
      INNER JOIN department ON role.department_id = department.id
      ORDER BY role.id
    `;
    const [rows] = await connection.query(query);
    console.table(rows);
  } catch (error) {
    console.error('Error viewing roles:', error);
  } finally {
    connection.release();
  }
}

// Function to get managers
async function getManagers(connection) {
  try {
    const [rows] = await connection.query('SELECT * FROM managers');
    return rows;
  } catch (error) {
    console.error('Error getting managers:', error);
    return [];
  } finally {
    connection.release();
  }
}

// Function to get employees managed by a manager
async function getEmployeesByManager(managerId, connection) {
  try {
    const query = 'SELECT * FROM employees WHERE manager_id = ?';
    const [rows] = await connection.query(query, [managerId]);
    return rows;
  } catch (error) {
    console.error('Error getting employees by manager:', error);
    return [];
  } finally {
    connection.release();
  }
}

// Function to add a department
async function addDepartment(departmentName, connection) {
  try {
    const query = 'INSERT INTO department (name) VALUES (?)';
    await connection.query(query, [departmentName]);
    console.log('Department added successfully.');
  } catch (error) {
    console.error('Error adding department:', error);
  } finally {
    connection.release();
  }
}

// Function to add a role
async function addRole(title, salary, departmentId, connection) {
  try {
    const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    await connection.query(query, [title, salary, departmentId]);
    console.log('Role added successfully.');
  } catch (error) {
    console.error('Error adding role:', error);
  } finally {
    connection.release();
  }
}

// Function to add an employee
async function addEmployee(firstName, lastName, roleId, managerId, connection) {
  try {
    const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    await connection.query(query, [firstName, lastName, roleId, managerId]);
    console.log('Employee added successfully.');
  } catch (error) {
    console.error('Error adding employee:', error);
  } finally {
    connection.release();
  }
}

// Function to update an employee's role
async function updateEmployeeRole(employeeId, roleId, connection) {
  try {
    const query = 'UPDATE employees SET role_id = ? WHERE id = ?';
    await connection.query(query, [roleId, employeeId]);
    console.log('Employee role updated successfully.');
  } catch (error) {
    console.error('Error updating employee\'s role:', error);
  } finally {
    connection.release();
  }
}

// Function to delete an employee
async function deleteEmployee(employeeId, connection) {
  try {
    const query = 'DELETE FROM employees WHERE id = ?';
    await connection.query(query, [employeeId]);
    console.log('Employee deleted successfully.');
  } catch (error) {
    console.error('Error deleting employee:', error);
  } finally {
    connection.release();
  }
}

// Function to update an employee's details
async function updateEmployeeDetails(employeeId, firstName, lastName, connection) {
  try {
    const query = 'UPDATE employees SET first_name = ?, last_name = ? WHERE id = ?';
    await connection.query(query, [firstName, lastName, employeeId]);
    console.log('Employee details updated successfully.');
  } catch (error) {
    console.error('Error updating employee\'s details:', error);
  } finally {
    connection.release();
  }
}

// Function to close the database connection
function closeConnection(connection) {
  connection.release();
  console.log('Database connection closed. Goodbye!');
}

module.exports = {
  getConnection,
  viewDepartments,
  viewRoles,
  getManagers,
  getEmployeesByManager,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  deleteEmployee,
  updateEmployeeDetails,
  closeConnection,
};
