require('dotenv').config();

// Import required modules
const inquirer = require('inquirer');
const cTable = require('console.table');
const { pool } = require('./config/dbConfig');
const Department = require('./lib/Department');
const Employee = require('./lib/Employee');
const Role = require('./lib/Role');

// Main function to start the application
async function main() {
  try {
    const connection = await pool.getConnection();

    await runEmployeeTracker(connection);
  } catch (error) {
    console.error('Error obtaining database connection:', error);
  }
}

// Run the employee tracker application
async function runEmployeeTracker(connection) {
  try {
    // Main application loop
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
          'Update an employee\'s role',
          'Delete an employee',
          'Update an employee\'s first name, last name, or manager',
          'Exit'
        ]
      }
    ]);

    // Call the appropriate function based on the user's choice
    switch (answer.action) {
      case 'View all departments':
        await viewDepartments(connection);
        break;
      case 'View all roles':
        await viewRoles(connection);
        break;
      case 'View all employees':
        await viewEmployees(connection);
        break;
      case 'Add a department':
        await addDepartment(connection);
        break;
      case 'Add a role':
        await addRole(connection);
        break;
      case 'Add an employee':
        await addEmployee(connection);
        break;
      case 'Update an employee\'s role':
        await updateEmployeeRole(connection);
        break;
      case 'Delete an employee':
        await deleteEmployee(connection);
        break;
      case 'Update an employee\'s first name, last name, or manager':
        await updateEmployeeDetails(connection);
        break;
      case 'Exit':
        await closeConnection(connection);
        return; // Exit the application
      default:
        console.log(`Invalid action: ${answer.action}`);
        await closeConnection(connection);
    }
  } catch (error) {
    console.error('Error:', error);
    await closeConnection(connection);
  }
}

// Function to view departments
async function viewDepartments(connection) {
  try {
    const [rows] = await connection.query('SELECT * FROM department ORDER BY id');
    console.table(rows);
  } catch (error) {
    console.error('Error viewing departments:', error);
  } finally {
    await runEmployeeTracker(connection);
  }
}

// Function to view roles
async function viewRoles(connection) {
  try {
    const query = `SELECT role.id, role.title, department.name AS department, role.salary 
                  FROM role 
                  INNER JOIN department ON role.department_id = department.id
                  ORDER BY role.id`;
    const [rows] = await connection.query(query);
    console.table(rows);
  } catch (error) {
    console.error('Error viewing roles:', error);
  } finally {
    await runEmployeeTracker(connection);
  }
}

// Function to view employees
async function viewEmployees(connection) {
  try {
    const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, 
                  CONCAT(m.first_name, ' ', m.last_name) AS manager 
                  FROM employee e 
                  LEFT JOIN role ON e.role_id = role.id 
                  LEFT JOIN department ON role.department_id = department.id 
                  LEFT JOIN employee m ON m.id = e.manager_id
                  ORDER BY e.id`;
    const [rows] = await connection.query(query);
    console.table(rows);
  } catch (error) {
    console.error('Error viewing employees:', error);
  } finally {
    await runEmployeeTracker(connection);
  }
}

// Function to add a department
async function addDepartment(connection) {
  try {
    const { departmentName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the new department:',
      },
    ]);

    await Department.addDepartment(departmentName, connection);
    console.log('Department added successfully.');
  } catch (error) {
    console.error('Error adding department:', error);
  } finally {
    await runEmployeeTracker(connection);
  }
}

// Function to add a role
async function addRole(connection) {
  try {
    const { title, salary, departmentId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the new role:',
      },
      {
        type: 'number',
        name: 'salary',
        message: 'Enter the salary for the new role:',
      },
      {
        type: 'number',
        name: 'departmentId',
        message: 'Enter the department ID for the new role:',
      },
    ]);

    await Role.addRole(title, salary, departmentId, connection);
    console.log('Role added successfully.');
  } catch (error) {
    console.error('Error adding role:', error);
  } finally {
    await runEmployeeTracker(connection);
  }
}

// Function to add an employee
async function addEmployee(connection) {
  try {
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter the first name of the new employee:',
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter the last name of the new employee:',
      },
      {
        type: 'number',
        name: 'roleId',
        message: 'Enter the role ID for the new employee:',
      },
      {
        type: 'number',
        name: 'managerId',
        message: 'Enter the manager ID for the new employee (if any, or leave blank):',
      },
    ]);

    await Employee.addEmployee(firstName, lastName, roleId, managerId, connection);
    console.log('Employee added successfully.');
  } catch (error) {
    console.error('Error adding employee:', error);
  } finally {
    await runEmployeeTracker(connection);
  }
}

// Function to update an employee's role
async function updateEmployeeRole(connection) {
  try {
    // Fetch all employees and roles to display as choices
    const employees = await Employee.getEmployees(connection);
    const roles = await Role.getRoles(connection);

    // Map the employees and roles to choices for inquirer prompts
    const employeeChoices = employees.map(e => ({ name: `${e.first_name} ${e.last_name}`, value: e.id }));
    const roleChoices = roles.map(r => ({ name: r.title, value: r.id }));

    // Prompt user for which employee and what new role
    const { employeeId, roleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Which employee\'s role would you like to update?',
        choices: employeeChoices
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Which role do you want to assign to the selected employee?',
        choices: roleChoices
      }
    ]);

    // Update employee's role
    await Employee.updateRole(employeeId, roleId, connection);
    console.log('Employee role updated successfully.');
  } catch (error) {
    console.error('Error updating employee role:', error);
  } finally {
    await runEmployeeTracker(connection);
  }
}

// Function to delete an employee
async function deleteEmployee(connection) {
  try {
    // Fetch all employees to display as choices
    const employees = await Employee.getEmployees(connection);
    const employeeChoices = employees.map(e => ({ name: `${e.first_name} ${e.last_name}`, value: e.id }));

    // Prompt user for which employee to delete
    const { employeeId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Which employee would you like to delete?',
        choices: employeeChoices
      }
    ]);

    // Delete the selected employee
    await Employee.delete(employeeId, connection);
    console.log('Employee deleted successfully.');
  } catch (error) {
    console.error('Error deleting employee:', error);
  } finally {
    await runEmployeeTracker(connection);
  }
}

// Function to update an employee's details (first name, last name, or manager)
async function updateEmployeeDetails(connection) {
  try {
    // Fetch all employees to display as choices, including the option for 'None' for manager
    const employees = await Employee.getEmployees(connection);
    const employeeChoices = employees.map(e => ({ name: `${e.first_name} ${e.last_name}`, value: e.id }));
    employeeChoices.unshift({ name: 'None', value: null });

    // Prompt user for which employee and what details to update
    const { employeeId, firstName, lastName, managerId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Which employee\'s details would you like to update?',
        choices: employeeChoices
      },
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter the new first name of the employee:',
        // Assuming you want to allow blank (no change)
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter the new last name of the employee:',
        // Assuming you want to allow blank (no change)
      },
      {
        type: 'list',
        name: 'managerId',
        message: 'Who is the new manager of the employee?',
        choices: employeeChoices
      }
    ]);

    // Update employee's details
    await Employee.updateDetails(employeeId, firstName, lastName, managerId, connection);
    console.log('Employee details updated successfully.');
  } catch (error) {
    console.error('Error updating employee details:', error);
  } finally {
    await runEmployeeTracker(connection);
  }
}

// Close database connection properly
async function closeConnection(connection) {
  try {
    await connection.release();
    console.log('Connection released back to the pool.');
    await pool.end();
    console.log('Database connection pool closed.');
  } catch (error) {
    console.error('Error closing the connection:', error);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down...');
  const connection = await pool.getConnection();
  await closeConnection(connection);
  process.exit(0);
});

// Start the application
main().catch(console.error);
