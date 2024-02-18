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
  deleteEmployee,
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
    try {
      const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        loop: false,
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Delete an employee',
          'Exit'
        ].concat(exitLoop ? ['Back'] : []),
      });
  
      switch (action) {
        case 'View all departments':
          console.table(await viewAllDepartments());
          break;
        case 'View all roles':
          console.table(await viewAllRoles());
          break;
        case 'View all employees':
          console.table(await viewAllEmployees());
          break;
        case 'Add a department':
          await addDepartment(await inquirer.prompt({
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?',
          }).departmentName);
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
          const { employeeId, newRoleId } = await inquirer.prompt([
            {
              type: 'list',
              name: 'employeeId',
              message: 'Which employee do you want to update?',
              choices: await getEmployeesForChoices(),
            },
            {
              type: 'list',
              name: 'newRoleId',
              message: 'Which role do you want to assign to the selected employee?',
              choices: await getRolesForChoices(),
            },
          ]);
          await updateEmployeeRole(employeeId, newRoleId);
          console.log('Employee role updated successfully!');
          break;
        case 'Delete an employee':
          const { employeeIdToDelete } = await inquirer.prompt({
            type: 'list',
            name: 'employeeIdToDelete',
            message: 'Which employee do you want to delete?',
            choices: await getEmployeesForChoices(),
          });
          await deleteEmployee(employeeIdToDelete);
          console.log('Employee deleted successfully!');
          break;
        case 'Exit':
          exitLoop = true;
          break;
        case 'Back':
          exitLoop = true; // Exit the current loop iteration to go back
          break;
        default:
          console.log('Invalid action selected');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

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

  try {
    await runEmployeeTracker();
  } catch (error) {
    console.error('Error in runEmployeeTracker:', error);
    process.exit(1);
  } finally {
    await closePool();
    console.log('Database connection pool closed.');
    console.log('Application exited successfully.');
    process.exit(0); // Explicitly exit the Node.js process
  }
}

main().catch((error) => {
  console.error('Error in main function:', error);
  process.exit(1);
});

// Listen for SIGINT signal (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down...');
  await closePool();
  process.exit(0);
});
