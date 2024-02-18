// ES6 import statements
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import express from 'express';
import { db, closePool } from './utils/queries.js';
import {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  getDepartmentsForChoices,
  getRolesForChoices,
  getEmployeesForChoices
} from './dbFunctions.js'; 

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Main CLI function
async function runEmployeeTracker() {
  let exitLoop = false;
  while (!exitLoop) {
    const { action } = await inquirer.prompt({
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
      ],
    });

    try {
      switch (action) {
        case 'View all departments':
          const departments = await viewAllDepartments();
          console.table(departments);
          break;
        case 'View all roles':
          const roles = await viewAllRoles();
          console.table(roles);
          break;
        case 'View all employees':
          const employees = await viewAllEmployees();
          console.table(employees);
          break;
        case 'Add a department':
          const { departmentName } = await inquirer.prompt({
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?',
          });
          await addDepartment(departmentName);
          console.log('Department added successfully!');
          break;
        case 'Add a role':
          const roleDetails = await inquirer.prompt([
            {
              type: 'input',
              name: 'title',
              message: 'What is the name of the role?',
            },
            {
              type: 'input',
              name: 'salary',
              message: 'What is the salary of the role?',
            },
            {
              type: 'list',
              name: 'departmentId',
              message: 'Which department does the role belong to?',
              choices: await getDepartmentsForChoices(),
            },
          ]);
          await addRole(roleDetails.title, roleDetails.salary, roleDetails.departmentId);
          console.log('Role added successfully!');
          break;
        case 'Add an employee':
          const employeeDetails = await inquirer.prompt([
            {
              type: 'input',
              name: 'firstName',
              message: "What is the employee's first name?",
            },
            {
              type: 'input',
              name: 'lastName',
              message: "What is the employee's last name?",
            },
            {
              type: 'list',
              name: 'roleId',
              message: "What is the employee's role?",
              choices: await getRolesForChoices(),
            },
            {
              type: 'list',
              name: 'managerId',
              message: "Who is the employee's manager?",
              choices: await getEmployeesForChoices(),
            },
          ]);
          await addEmployee(employeeDetails.firstName, employeeDetails.lastName, employeeDetails.roleId, employeeDetails.managerId);
          console.log('Employee added successfully!');
          break;
        case 'Update an employee role':
          const { employeeId } = await inquirer.prompt({
            type: 'list',
            name: 'employeeId',
            message: 'Which employee do you want to update?',
            choices: await getEmployeesForChoices(),
          });
          const { newRoleId } = await inquirer.prompt({
            type: 'list',
            name: 'newRoleId',
            message: 'Which role do you want to assign to the selected employee?',
            choices: await getRolesForChoices(),
          });
          await updateEmployeeRole(employeeId, newRoleId);
          console.log('Employee role updated successfully!');
          break;
        case 'Exit':
          exitLoop = true;
          break;
        default:
          console.log('Invalid action selected');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Close the pool and exit the application after the loop ends
  await closePool();
  console.log('Application exited successfully.');
}

// Define Express routes
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await db.select('SELECT * FROM department');
    res.json(departments);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Function to start the Express server and the CLI application
async function main() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Start the CLI after the server is up and running
  runEmployeeTracker().catch((error) => {
    console.error('Error in runEmployeeTracker:', error);
    process.exit(1);
  });
}

main().catch((error) => {
  console.error('Error in main function:', error);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down...');
  await closePool();
  process.exit(0);
});
