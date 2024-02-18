import 'dotenv/config';
import express from 'express';
import { json } from 'express';
import inquirer from 'inquirer';
import cTable from 'console.table';
import { pool } from './dbFunctions'; // Ensure this module exports the pool
import * as db from './queries'; // Adjust the path as needed

const app = express();
app.use(json());

const PORT = process.env.PORT || 3000;

// Function to obtain a database connection
const getConnection = async () => pool.promise().getConnection();

// Function to start the CLI application
const runEmployeeTracker = async (connection) => {
  let exitLoop = false;
  while (!exitLoop) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          // Add all other actions here
          'Exit',
        ],
      },
    ]);

    switch (action) {
      case 'View all departments':
        const departments = await db.viewDepartments(connection);
        console.table(departments);
        break;
      // Add cases for all other actions here
      case 'Exit':
        exitLoop = true;
        break;
    }
  }
  await closeConnection(connection); // Close connection when the user decides to exit
};

// Express API routes
app.get('/api/departments', async (req, res) => {
  const connection = await getConnection();
  try {
    const departments = await db.viewDepartments(connection);
    res.json(departments);
  } catch (error) {
    res.status(500).send('Server Error');
  } finally {
    connection.release();
  }
});

// Additional Express routes
app.get('/api/roles', async (req, res) => {
  const connection = await getConnection();
  try {
    const roles = await db.viewRoles(connection);
    res.json(roles);
  } catch (error) {
    res.status(500).send('Server Error');
  } finally {
    connection.release();
  }
});

// Add other routes...

// Function to close the database connection
const closeConnection = async (connection) => {
  try {
    await connection.release();
    console.log('Connection released and database pool is still active.');
  } catch (error) {
    console.error('Error releasing the connection:', error);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down...');
  await pool.end();
  app.close(() => {
    console.log('Express server terminated');
    process.exit(0);
  });
});

// Main function to start the application
const main = async () => {
  try {
    const connection = await db.pool.getConnection();

    // Run the CLI application
    await runEmployeeTracker(connection);

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error obtaining database connection:', error);
  }
};

main().catch(console.error);
