require('dotenv').config();

// Import required modules
const inquirer = require('inquirer');
const mysql = require('mysql2/promise'); // Use mysql2/promise for async queries
const cTable = require('console.table');
const dbConfig = require('./config/dbConfig'); // Create a separate configuration file

// Create a connection pool to the database
const pool = mysql.createPool(dbConfig);

// Function to start the Employee Tracker application
async function runEmployeeTracker(connection) {
  try {
    // Get a connection from the pool
    connection = await pool.getConnection();

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',

          
'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee\'s role',
          'Delete an employee',
          'Update an employee\'s first name, last name, or manager',
          'Exit'
        ]
      }
    ]);

    switch (answer.action) {
      case 'View all departments':
        await viewDepartments(connection);
        break;
      case 'View all roles':
        await viewRoles(connection);
        break;
      case 'View all employees':
        await viewEmployees(connection);
        break;
      case 'Add a department':
        await addDepartment(connection);
        break;
      case 'Add a role':
        await addRole(connection);
        break;
      case 'Add an employee':
        await addEmployee(connection);
        break;
      case 'Update an employee\'s role':
        await updateEmployeeRole(connection);
        break;
      case 'Delete an employee':
        await deleteEmployee(connection, answer.employee);
        break;
      case 'Update an employee\'s first name, last name, or manager':
        await updateEmployee(connection, answer.employee, answer.updates);
        break;
      case 'Exit':
        closeConnection(connection);
        break;
      default:
        console.log(`Invalid action: ${answer.action}`);
        closeConnection(connection);
    }
  } catch (error) {
    console.error('Error:', error);
    closeConnection(connection);
  }
}

// Function to view departments
async function viewDepartments(connection) {
  try {
    const [rows] = await connection.query('SELECT * FROM department');
    console.table(rows);
    runEmployeeTracker(connection);
  } catch (error) {
    console.error('Error:', error);
    closeConnection(connection);
  }
}

// Function to view roles
async function viewRoles(connection) {
  try {
    const query = `SELECT role.id, role.title, department.name AS department, role.salary 
                  FROM role 
                  INNER JOIN department ON role.department_id = department.id`;
    const [rows] = await connection.query(query);
    console.table(rows);
    runEmployeeTracker(connection);
  } catch (error) {
    console.error('Error:', error);
    closeConnection(connection);
  }
}

// Function to view employees
async function viewEmployees(connection) {
  try {
    const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager 
                  FROM employee e 
                  LEFT JOIN role ON e.role_id = role.id 
                  LEFT JOIN department ON role.department_id = department.id 
                  LEFT JOIN employee m ON m.id = e.manager_id`;
    const [rows] = await connection.query(query);
    console.table(rows);
    runEmployeeTracker(connection);
  } catch (error) {
    console.error('Error:', error);
    closeConnection(connection);
  }
}

// Function to add a department
async function addDepartment(connection) {
  try {
    const answer = await inquirer.prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the name of the new department?'
      }
    ]);

    await connection.query('INSERT INTO department SET ?', {
      name: answer.newDepartment
    });

    console.log(`Added ${answer.newDepartment} to departments.`);
    runEmployeeTracker(connection);
  } catch (error) {
    console.error('Error:', error);
    closeConnection(connection);
  }
}