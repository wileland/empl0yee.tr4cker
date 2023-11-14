// index.js

const inquirer = require('inquirer');
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_username', // replace with your MySQL username
    password: 'your_password', // replace with your MySQL password
    database: 'your_database_name' // replace with your database name
});

// Connect to the MySQL server
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
    runEmployeeTracker();
});

// Function to start the Employee Tracker application
function runEmployeeTracker() {
    inquirer.prompt([
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
                'Update an employee role',
                'Exit'
            ]
        }
    ])
    .then(answer => {
        switch(answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                closeConnection();
                break;
            default:
                console.log(`Invalid action: ${answer.action}`);
                closeConnection();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        closeConnection();
    });
}

// Close the database connection when done
function closeConnection() {
    connection.end();
}

// Placeholder functions for each action
function viewDepartments() {
    // Logic for viewing departments
}

function viewRoles() {
    // Logic for viewing roles
}

function viewEmployees() {
    // Logic for viewing employees
}

function addDepartment() {
    // Logic for adding a department
}

function addRole() {
    // Logic for adding a role
}

function addEmployee() {
    // Logic for adding an employee
}

function updateEmployeeRole() {
    // Logic for updating an employee role
}
