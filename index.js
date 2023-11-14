const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_username', // Replace with your MySQL username
    password: 'your_mysql_password', // Replace with your MySQL password
    database: 'empl0yee_tr4cker_db' // Replace with your database name
});

// Connect to the MySQL server
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
    runEmployeeTracker();
});

// Function to start the Employee Tracker application
function runEmployeeTracker() {
    // Inquirer prompts for user actions
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
        // Switch statement to handle user-selected actions
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


function viewDepartments() {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.table(results);
        runEmployeeTracker();
    });
}

function viewRoles() {
    const query = `SELECT role.id, role.title, department.name AS department, role.salary 
                   FROM role 
                   INNER JOIN department ON role.department_id = department.id`;
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        runEmployeeTracker();
    });
}

function viewEmployees() {
    const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager 
                   FROM employee e 
                   LEFT JOIN role ON e.role_id = role.id 
                   LEFT JOIN department ON role.department_id = department.id 
                   LEFT JOIN employee m ON m.id = e.manager_id`;
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        runEmployeeTracker();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'input',
            message: 'What is the name of the new department?'
        }
    ]).then(answer => {
        connection.query('INSERT INTO department SET ?', {
            name: answer.newDepartment
        }, (err) => {
            if (err) throw err;
            console.log(`Added ${answer.newDepartment} to departments.`);
            runEmployeeTracker();
        });
    });
}

function addRole() {
    connection.query('SELECT * FROM department', (err, departments) => {
        if (err) throw err;
        inquirer.prompt([
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
                choices: departments.map(department => ({ name: department.name, value: department.id })),
                message: 'Which department does this role belong to?'
            }
        ]).then(answers => {
            connection.query('INSERT INTO role SET ?', {
                title: answers.title,
                salary: answers.salary,
                department_id: answers.department
            }, (err) => {
                if (err) throw err;
                console.log(`Added ${answers.title} to roles.`);
                runEmployeeTracker();
            });
        });
    });
}

function addEmployee() {
    connection.promise().query('SELECT * FROM role')
    .then(([roles]) => {
        return Promise.all([
            roles,
            connection.promise().query('SELECT * FROM employee')
        ]);
    })
    .then(([roles, employees]) => {
        inquirer.prompt([
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
                    ...employees[0].map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }))
                ],
                message: 'Who is the employee\'s manager?'
            }
        ]).then(answers => {
            connection.query('INSERT INTO employee SET ?', {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.role,
                manager_id: answers.manager
            }, (err) => {
                if (err) throw err;
                console.log(`Added ${answers.firstName} ${answers.lastName} to employees.`);
                runEmployeeTracker();
            });
        });
    })
    .catch(err => {
        console.error(err);
        runEmployeeTracker();
    });
}

function updateEmployeeRole() {
    connection.promise().query('SELECT * FROM employee')
    .then(([employees]) => {
        return Promise.all([
            employees,
            connection.promise().query('SELECT * FROM role')
        ]);
    })
    .then(([employees, roles]) => {
        inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                choices: employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id })),
                message: 'Which employee\'s role do you want to update?'
            },
            {
                name: 'role',
                type: 'list',
                choices: roles[0].map(role => ({ name: role.title, value: role.id })),
                message: 'What is the new role of the employee?'
            }
        ]).then(answers => {
            connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.role, answers.employee], (err) => {
                if (err) throw err;
                console.log('Updated employee role.');
                runEmployeeTracker();
            });
        });
    })
    .catch(err => {
        console.error(err);
        runEmployeeTracker();
    });
}

function closeConnection() {
    connection.end();
}

