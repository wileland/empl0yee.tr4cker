const { runEmployeeTracker } = require('../index');
const Department = require('../lib/Department');
const Employee = require('../lib/Employee');
const Role = require('../lib/Role');
const dbConfig = require('../config/dbConfig');
const inquirer = require('inquirer');

jest.mock('inquirer');
jest.mock('../lib/Department');
jest.mock('../lib/Employee');
jest.mock('../lib/Role');

describe('Employee Tracker Tests', () => {
  beforeAll(async () => {
    // Mock the database connection
    dbConfig.connect = jest.fn().mockResolvedValue();
    dbConfig.close = jest.fn().mockResolvedValue();
  });

  // No need to reset the database since we are mocking the DB operations

  // Test that the runEmployeeTracker() function prompts the user to select an option
  test('runEmployeeTracker() function prompts the user to select an option', async () => {
    // Mock inquirer to provide user input
    inquirer.prompt.mockResolvedValueOnce({ action: 'Add Department' });
    
    // Simulate running the Employee Tracker
    await runEmployeeTracker();

    // Verify that the inquirer prompt was called
    expect(inquirer.prompt).toHaveBeenCalled();
  });

  // Test that the function handles user actions correctly
  test('runEmployeeTracker() handles the Add Department action', async () => {
    // Set up the mock implementation to simulate adding a department
    Department.addDepartment = jest.fn().mockResolvedValue(1); // Simulate department ID returned
    inquirer.prompt.mockResolvedValueOnce({ action: 'Add Department' })
      .mockResolvedValueOnce({ departmentName: 'Engineering' }); // User input for department name

    // Simulate running the Employee Tracker
    await runEmployeeTracker();

    // Verify that the addDepartment method was called with the right arguments
    expect(Department.addDepartment).toHaveBeenCalledWith('Engineering');
  });

  // Other tests...

  // Test that the function handles exiting correctly
  test('runEmployeeTracker() exits the program when the user selects Exit', async () => {
    // Mock inquirer to simulate user selecting 'Exit'
    inquirer.prompt.mockResolvedValueOnce({ action: 'Exit' });
    
    // Simulate running the Employee Tracker
    const consoleSpy = jest.spyOn(console, 'log');
    await runEmployeeTracker();

    // Verify that a goodbye message or similar was logged
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Goodbye'));
  });

  // Add tests for addEmployee, addRole, etc., similar to the addDepartment test above
  // Note: You would mock the respective class methods just like we did with Department.addDepartment
});
