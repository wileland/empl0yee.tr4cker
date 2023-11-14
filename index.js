require('dotenv').config();

// Import required modules
const inquirer = require('inquirer');
const cTable = require('console.table');
const { pool } = require('./config/dbConfig');
const Department = require('./lib/Department');
const Employee = require('./lib/Employee');
const Role = require('./lib/Role');

async function runEmployeeTracker() {
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
// Function to add a department using the Department class
async function addDepartment() {
  try {
    const answer = await inquirer.prompt([
      {
        name: 'name',
        type: 'input',
        message: 'What is the name of the new department?'
      }
    ]);

    const departmentId = await Department.addDepartment(answer.name);
    console.log(`Added new department with ID: ${departmentId}`);
    runEmployeeTracker();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
  }
}

// Function to add a role using the Role class
async function addRole() {
  try {
    const departments = await Department.getDepartments();
    const departmentChoices = departments.map((dept) => ({
      name: dept.name,
      value: dept.id
    }));

    const answers = await inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'What is the title of the new role?'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary of the new role?',
        validate: (value) => !isNaN(value) || 'Please enter a number'
      },
      {
        name: 'departmentId',
        type: 'list',
        message: 'Which department does this role belong to?',
        choices: departmentChoices
      }
    ]);

    const roleId = await Role.addRole(answers.title, answers.salary, answers.departmentId);
    console.log(`Added new role with ID: ${roleId}`);
    runEmployeeTracker();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
  }
}

// Function to add an employee using the Employee class
async function addEmployee() {
  try {
    const roles = await Role.getRoles();
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id
    }));

    const answers = await inquirer.prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'What is the first name of the employee?'
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'What is the last name of the employee?'
      },
      {
        name: 'roleId',
        type: 'list',
        message: 'What is the role of the employee?',
        choices: roleChoices
      },
      // If needed, add another prompt for selecting the manager
    ]);

    const employeeId = await Employee.addEmployee(answers.firstName, answers.lastName, answers.roleId, null); // Assuming no manager for now
    console.log(`Added new employee with ID: ${employeeId}`);
    runEmployeeTracker();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
  }
}

// Ensure to implement the other operations in a similar manner using their respective classes.

// Start the application
runEmployeeTracker();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down...');
  await pool.end();
  process.exit(0);
});