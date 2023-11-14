require('dotenv').config();
const inquirer = require('inquirer');
const cTable = require('console.table');
const express = require('express');
const mysql = require('mysql2');
const dbFunctions = require('./dbFunctions'); // Ensure this module has all the required functions

// Set up the MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Function to start the CLI application
async function runEmployeeTracker(connection) {
  // Your CLI application logic goes here
  let exitLoop = false;
  while (!exitLoop) {
    // Use inquirer to get the user's action choice
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
      // Match the case with the user's choice and call the respective dbFunctions
      case 'View all departments':
        const departments = await dbFunctions.viewDepartments(connection);
        console.table(departments);
        break;
      // Add cases for all other actions here
      case 'Exit':
        exitLoop = true;
        break;
    }
  }
  await closeConnection(connection); // Close connection when the user decides to exit
}

// Function to obtain a database connection
async function getConnection() {
  return pool.promise().getConnection();
}

// Function to start the application
async function main() {
  try {
    const connection = await getConnection();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    await runEmployeeTracker(connection);
  } catch (error) {
    console.error('Error starting the application:', error);
    pool.end();
  }
}

// Express API routes
app.get('/api/departments', async (req, res) => {
  const connection = await getConnection();
  try {
    const departments = await dbFunctions.viewDepartments(connection);
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
    const roles = await dbFunctions.viewRoles(connection);
    res.json(roles);
  } catch (error) {
    res.status(500).send('Server Error');
  } finally {
    connection.release();
  }
});

app.get('/api/employees', async (req, res) => {
  const connection = await getConnection();
  try {
    const employees = await dbFunctions.viewEmployees(connection);
    res.json(employees);
  } catch (error) {
    res.status(500).send('Server Error');
  } finally {
    connection.release();
  }
});

app.put('/api/employees/:id/role', async (req, res) => {
  const { id } = req.params;
  const { roleId } = req.body; // Expecting { roleId: newRoleId }
  const connection = await getConnection();
  try {
    await dbFunctions.updateEmployeeRole(id, roleId, connection);
    res.send('Employee role updated successfully');
  } catch (error) {
    res.status(500).send('Server Error');
  } finally {
    connection.release();
  }
});

app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, managerId } = req.body;
  const connection = await getConnection();
  try {
    await dbFunctions.updateEmployeeDetails(id, firstName, lastName, managerId, connection);
    res.send('Employee details updated successfully');
  } catch (error) {
    res.status(500).send('Server Error');
  } finally {
    connection.release();
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const connection = await getConnection();
  try {
    await dbFunctions.deleteEmployee(id, connection);
    res.send('Employee deleted successfully');
  } catch (error) {
    res.status(500).send('Server Error');
  } finally {
    connection.release();
  }
});

// ... include other routes as needed for update and delete operations ...

// Function to close the database connection
async function closeConnection(connection) {
  try {
    await connection.release();
    console.log('Connection released and database pool is still active.');
  } catch (error) {
    console.error('Error releasing the connection:', error);
  }
}

main();

process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down...');
  await pool.end();
  app.close(() => {
    console.log('Express server terminated');
    process.exit(0);
  });
});
