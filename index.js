// Import required modules
const inquirer = require('inquirer');
const mysql = require('mysql2/promise'); // Use mysql2/promise for async queries
const cTable = require('console.table');
const dbConfig = require('./config/dbConfig'); // Create a separate configuration file

// Create a connection pool to the database
const pool = mysql.createPool(dbConfig);

// Function to start the Employee Tracker application
async function runEmployeeTracker() {
    try {
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
                    'Update an employee role',
                    'Exit'
                ]
            }
        ]);

        switch (answer.action) {
            case 'View all departments':
                await viewDepartments();
                break;
            case 'View all roles':
                await viewRoles();
                break;
            case 'View all employees':
                await viewEmployees();
                break;
            case 'Add a department':
                await addDepartment();
                break;
            case 'Add a role':
                await addRole();
                break;
            case 'Add an employee':
                await addEmployee();
                break;
            case 'Update an employee role':
                await updateEmployeeRole();
                break;
            case 'Exit':
                closeConnection();
                break;
            default:
                console.log(`Invalid action: ${answer.action}`);
                closeConnection();
        }
    } catch (error) {
        console.error('Error:', error);
        closeConnection();
    }
}

async function viewDepartments() {
    const [rows] = await pool.query('SELECT * FROM department');
    console.table(rows);
    runEmployeeTracker();
}

// ... (Previous code)

async function viewRoles() {
    const query = `SELECT role.id, role.title, department.name AS department, role.salary 
                   FROM role 
                   INNER JOIN department ON role.department_id = department.id`;
    const [rows] = await pool.query(query);
    console.table(rows);
    runEmployeeTracker();
}

async function viewEmployees() {
    const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager 
                   FROM employee e 
                   LEFT JOIN role ON e.role_id = role.id 
                   LEFT JOIN department ON role.department_id = department.id 
                   LEFT JOIN employee m ON m.id = e.manager_id`;
    const [rows] = await pool.query(query);
    console.table(rows);
    runEmployeeTracker();
}

async function addDepartment() {
    const answer = await inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'input',
            message: 'What is the name of the new department?'
        }
    ]);

    await pool.query('INSERT INTO department SET ?', {
        name: answer.newDepartment
    });

    console.log(`Added ${answer.newDepartment} to departments.`);
    runEmployeeTracker();
}

async function addRole() {
    const departments = await pool.query('SELECT * FROM department');

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
            validate: value => !isNaN(value)
        },
        {
            name: 'department',
            type: 'list',
            choices: departments[0].map(department => ({ name: department.name, value: department.id })),
            message: 'Which department does this role belong to?'
        }
    ]);

    await pool.query('INSERT INTO role SET ?', {
        title: answers.title,
        salary: answers.salary,
        department_id: answers.department
    });

    console.log(`Added ${answers.title} to roles.`);
    runEmployeeTracker();
}

async function addEmployee() {
    const [roles] = await pool.query('SELECT * FROM role');
    const [employees] = await pool.query('SELECT * FROM employee');

    const answers = await inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'What is the employee\'s first name?'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'What is the employee\'s last name?'
        },
        {
            name: 'role',
            type: 'list',
            choices: roles.map(role => ({ name: role.title, value: role.id })),
            message: 'What is the employee\'s role?'
        },
        {
            name: 'manager',
            type: 'list',
            choices: [
                { name: 'None', value: null },
                ...employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }))
            ],
            message: 'Who is the employee\'s manager?'
        }
    ]);

    await pool.query('INSERT INTO employee SET ?', {
        first_name: answers.firstName,
        last_name: answers.lastName,
        role_id: answers.role,
        manager_id: answers.manager
    });

    console.log(`Added ${answers.firstName} ${answers.lastName} to employees.`);
    runEmployeeTracker();
}

async function updateEmployeeRole() {
    const [employees] = await pool.query('SELECT * FROM employee');
    const [roles] = await pool.query('SELECT * FROM role');

    const answers = await inquirer.prompt([
        {
            name: 'employee',
            type: 'list',
            choices: employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id })),
            message: 'Which employee\'s role do you want to update?'
        },
        {
            name: 'role',
            type: 'list',
            choices: roles.map(role => ({ name: role.title, value: role.id })),
            message: 'What is the new role of the employee?'
        }
    ]);

    await pool.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.role, answers.employee]);

    console.log('Updated employee role.');
    runEmployeeTracker();
}

// Function to close the database connection
function closeConnection() {
    pool.end();
}

// Call the main function to start the application
runEmployeeTracker();
