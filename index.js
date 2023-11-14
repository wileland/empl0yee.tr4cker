
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
    // Obtain a connection from the pool
    const connection = await pool.getConnection();

    // Get the list of roles and map them to choices for inquirer prompt
    const roles = await Role.getRoles(connection);
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id
    }));

    // Get the list of managers (could be a list of employees)
    const managers = await Employee.getEmployees(connection);
    const managerChoices = managers.map((manager) => ({
      name: `${manager.first_name} ${manager.last_name}`,
      value: manager.id
    }));

    managerChoices.unshift({ name: 'None', value: null });

    const answers = await inquirer.prompt([
      // ... First name and last name prompts ...
      {
        name: 'roleId',
        type: 'list',
        message: 'What is the role of the employee?',
        choices: roleChoices
      },
      {
        name: 'managerId',
        type: 'list',
        message: 'Who is the employee\'s manager?',
        choices: managerChoices
      },
    ]);

    // Validate the selected role
    const roleExists = roles.some(role => role.id === answers.roleId);
    if (!roleExists) {
      throw new Error('Selected role does not exist.');
    }

    // Validate the selected manager
    if (answers.managerId !== null && !managers.some(manager => manager.id === answers.managerId)) {
      throw new Error('Selected manager does not exist.');
    }

    // Proceed with adding the employee
    const employeeId = await Employee.addEmployee(
      answers.firstName, answers.lastName, answers.roleId, answers.managerId, connection
    );
    console.log(`Added new employee with ID: ${employeeId}`);

    // Release the connection back to the pool
    connection.release();
    runEmployeeTracker();
  } catch (error) {
    console.error('Error:', error);
    // Release the connection in case of error as well
    if (connection) connection.release();
    await pool.end();
  }
}
// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down...');
  await pool.end();
  process.exit(0);
});