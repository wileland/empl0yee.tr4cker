// ES6 import statements
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import cTable from 'console.table';
import express from 'express';
import { db, closePool } from './utils/queries.js'; // Assuming you export closePool for closing the connection

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
        'Exit',
        // Add other options here
      ],
    });

    switch (action) {
      case 'View all departments':
        try {
          const departments = await db.select('SELECT * FROM department');
          console.table(departments);
        } catch (error) {
          console.error('Error viewing departments:', error);
        }
        break;
      case 'Exit':
        exitLoop = true;
        break;
      default:
        console.log('Invalid action selected');
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

// Additional routes for roles, employees, etc., should be defined here

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
  await closePool(); // Ensure this function exists in queries.js and closes the pool properly
  process.exit(0);
});
