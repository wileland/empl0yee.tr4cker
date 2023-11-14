jest.mock('inquirer');
const inquirer = require('inquirer');

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

test('Adding an employee', async () => {
  // Define employee information for testing
  const employeeInfo = {
    firstName: 'John',
    lastName: 'Doe',
    role: 'Manager',
    department: 'HR',
  };

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
test('Running the Employee Tracker', async () => {
  // Your test code here
}, 10000); // Set the timeout to 10 seconds (or adjust as needed)

