require('dotenv').config();
const inquirer = require('inquirer');
const cTable = require('console.table');
const express = require('express');
const mysql = require('mysql2');
const dbFunctions = require('./dbFunctions'); // Ensure this module has all the required functions
const db = require('./queries'); // Adjust the path as needed

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

// Function to obtain a database connection
async function getConnection() {
  return pool.promise().getConnection();
}

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

// Create routes for creating departments, roles, and employees
app.post('/api/departments', async (req, res) => {
  // Implement the logic to create a new department
  try {
    // Your code to create a new department goes here
    res.send('Department created successfully');
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.post('/api/roles', async (req, res) => {
  // Implement the logic to create a new role
  try {
    // Your code to create a new role goes here
    res.send('Role created successfully');
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.post('/api/employees', async (req, res) => {
  // Implement the logic to create a new employee
  try {
    // Your code to create a new employee goes here
    res.send('Employee created successfully');
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// ... Include other routes as needed for create operations ...

// Function to close the database connection
async function closeConnection(connection) {
  try {
    await connection.release();
    console.log('Connection released and database pool is still active.');
  } catch (error) {
    console.error('Error releasing the connection:', error);
  }
}

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
async function main() {
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
}

main().catch(console.error);
