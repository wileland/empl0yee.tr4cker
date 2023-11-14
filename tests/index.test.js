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

  afterEach(async () => {
    await dbConfig.resetDatabase();
  });

  afterAll(async () => {
    await dbConfig.close();
  });

  // Test that the runEmployeeTracker() function prompts the user to select an option.
  test('runEmployeeTracker() function prompts the user to select an option', async () => {
    // Mock inquirer to provide user input
    inquirer.prompt.mockResolvedValueOnce({ option: 'Add Department' });

    // Add an assertion to verify that the runEmployeeTracker() function prompts the user to select an option
    expect(inquirer.prompt).toHaveBeenCalledWith([
      {
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: ['Add Department', 'Add Employee', 'Add Role', 'View Departments', 'View Employees', 'View Roles', 'Exit'],
      },
    ]);
  });

  // Test that the runEmployeeTracker() function returns the result of the user's selection.
  test('runEmployeeTracker() function returns the result of the user\'s selection', async () => {
    // Mock inquirer to provide user input
    inquirer.prompt.mockResolvedValueOnce({ option: 'Add Department' });

    // Add an assertion to verify that the runEmployeeTracker() function returns the result of the user's selection
    const result = await runEmployeeTracker();

    expect(result).toEqual('Added Department');
  });

  // Test that the runEmployeeTracker() function handles invalid user input gracefully.
  test('runEmployeeTracker() function handles invalid user input', async () => {
    // Mock inquirer to provide invalid user input
    inquirer.prompt.mockResolvedValueOnce({ option: 'Invalid option' });

    // Add an assertion to verify that the runEmployeeTracker() function handles invalid user input gracefully
    const result = await runEmployeeTracker();

    expect(result).toEqual('Invalid option');
  });

  // Test that the runEmployeeTracker() function exits the program when the user selects Exit.
  test('runEmployeeTracker() function exits the program when the user selects Exit', async () => {
    // Mock inquirer to provide user input to exit the program
    inquirer.prompt.mockResolvedValueOnce({ option: 'Exit' });

    // Add an assertion to verify that the runEmployeeTracker() function exits the program when the user selects Exit
    const result = await runEmployeeTracker();

    expect(process.exit).toHaveBeenCalled();
  });

  // Test that the addDepartment() method adds a new department to the database.
  test('addDepartment() method adds a new department to the database', async () => {
    const newDepartment = 'Test Department';

    await addDepartment(newDepartment);

    const departments = await viewDepartments();

    expect(departments).toContainEqual(
      expect.objectContaining({
        name: newDepartment,
      })
    );
  });

  // Test that the addEmployee() method adds a new employee to the database.
  test('addEmployee() method adds a new employee to the database', async () => {
    const employeeInfo = {
      firstName: 'John',
      lastName: 'Doe',
      role: 'Manager',
      department: 'HR',
    };

    await addEmployee(employeeInfo);

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

  // Test that the addRole() method adds a new role to the database.
  test('addRole() method adds a new role to the database', async () => {
    const newRole = {
      title: 'Software Engineer',
      salary: 80000,
      department: 'Engineering',
    };

    await addRole(newRole);

    const roles = await viewRoles();