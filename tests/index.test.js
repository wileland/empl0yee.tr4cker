const {
  runEmployeeTracker,
  addDepartment,
  viewDepartments,
  addEmployee,
  viewEmployees,
  addRole,
  viewRoles,
} = require('../index');
const dbConfig = require('../config/dbConfig');
const inquirer = require('inquirer'); // Import the inquirer library

jest.mock('inquirer');

describe('Employee Tracker Tests', () => {
  beforeAll(async () => {
    await dbConfig.connect();
  });

  afterAll(async () => {
    await dbConfig.close();
  });

  beforeEach(async () => {
    await dbConfig.resetDatabase();
  });

  test('Running the Employee Tracker', async () => {
    // Mock inquirer to provide user input (if needed)
    inquirer.prompt.mockResolvedValue({}); // Replace with input as needed

    const result = await runEmployeeTracker();

    // Add your assertions here to check if the Employee Tracker runs successfully
    // For example, you can expect the result to be a success message or a specific output
    expect(result).toBeDefined();
  });

  test('Adding a department', async () => {
    const newDepartment = 'Test Department';

    // Mock inquirer to provide user input for adding a department
    inquirer.prompt.mockResolvedValueOnce({ departmentName: newDepartment });

    await addDepartment();

    const departments = await viewDepartments();

    expect(departments).toContainEqual(
      expect.objectContaining({
        name: newDepartment,
      })
    );
  });

  test('Adding an employee', async () => {
    const employeeInfo = {
      firstName: 'John',
      lastName: 'Doe',
      role: 'Manager',
      department: 'HR',
    };

    // Mock inquirer to provide user input for adding an employee
    inquirer.prompt.mockResolvedValueOnce(employeeInfo);

    await addEmployee();

    const employees = await viewEmployees();

    expect(employees).toContainEqual(
      expect.objectContaining({
        first_name: 'John',
        last_name: 'Doe',
        role: 'Manager',
        department: 'HR',
      })
    );
  });

  test('Adding a role', async () => {
    const newRole = {
      title: 'Software Engineer',
      salary: 80000,
      department: 'Engineering',
    };

    // Mock inquirer to provide user input for adding a role
    inquirer.prompt.mockResolvedValueOnce(newRole);

    await addRole();

    const roles = await viewRoles();

    expect(roles).toContainEqual(
      expect.objectContaining({
        title: 'Software Engineer',
        salary: 80000,
        department: 'Engineering',
      })
    );
  });

  // Add more test cases for other functions as needed
});
