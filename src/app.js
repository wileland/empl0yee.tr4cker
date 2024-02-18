// ES6 import statements
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import express from 'express';
import { db, closePool } from './utils/queries.js'; // Assuming closePool is correctly exported for closing the connection
import { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } from './utils/dbFunctions.js';

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
          // Implementation for adding a department
          break;
        case 'Add a role':
          // Implementation for adding a role
          break;
        case 'Add an employee':
          // Implementation for adding an employee
          break;
        case 'Update an employee role':
          // Implementation for updating an employee's role
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
