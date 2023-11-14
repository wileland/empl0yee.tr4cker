jest.mock('inquirer');
const inquirer = require('inquirer');

const dbConfig = require('../config/dbConfig');

const { runEmployeeTracker } = require('../index');

test('Running the Employee Tracker', async () => {
  // Perform the test
  const result = await runEmployeeTracker();

  // Add your assertions here to check if the Employee Tracker runs successfully
  // For example, you can expect the result to be a success message or a specific output
  expect(result).toBeDefined(); // You can modify this expectation based on the actual output of runEmployeeTracker
});

// Add more test cases for other index-related functions as needed
const { addDepartment, viewDepartments } = require('../index');

test('Adding a department', async () => {
  // Define a new department for testing
  const newDepartment = 'Test Department';

  // Perform the test by adding the department
  await addDepartment(newDepartment);

  // Check if the department was added successfully
  const departments = await viewDepartments();

  // Add your assertions here to check if the new department is in the result
  expect(departments).toContainEqual(
    expect.objectContaining({
      name: newDepartment,
    })
  );
});

// Add more test cases for other department-related functions as needed
const inquirer = require('inquirer');

// Mock Inquirer prompt
jest.mock('inquirer');

const { addEmployee, viewEmployees } = require('../index');



  // Mock the Inquirer prompt to avoid waiting for user input
  inquirer.prompt.mockResolvedValueOnce(employeeInfo);

  // Perform the test by adding the employee
  await addEmployee();

  // Check if the employee was added successfully
  const employees = await viewEmployees();

  // Add your assertions here to check if the employee information is in the result
  expect(employees).toContainEqual(
    expect.objectContaining({
      first_name: 'John',
      last_name: 'Doe',
      role: 'Manager',
      department: 'HR',
    })
  );
});

// Add more test cases for other employee-related functions as needed
test('Adding a department', async () => {
  // ...
}, 10000); // Set the timeout to 10 seconds (or adjust as needed)
