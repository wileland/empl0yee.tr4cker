const { addEmployee, viewEmployees, removeEmployee } = require('../index');
const dbConfig = require('../config/dbConfig');
const inquirer = require('inquirer'); // Import the inquirer library

jest.mock('inquirer');

describe('Employee Tests', () => {
  beforeAll(async () => {
    await dbConfig.connect();
  });

  afterAll(async () => {
    await dbConfig.close();
  });

  beforeEach(async () => {
    await dbConfig.resetDatabase();
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

  test('Removing an employee', async () => {
    const employeeInfo = {
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'Employee',
      department: 'IT',
    };

    // Mock inquirer to provide user input for adding an employee
    inquirer.prompt.mockResolvedValueOnce(employeeInfo);

    await addEmployee(employeeInfo);

    const employeesBefore = await viewEmployees();

    // Mock inquirer to provide user input for removing an employee
    inquirer.prompt.mockResolvedValueOnce({
      employeeId: employeesBefore[0].id, // Assuming it's the first employee
    });

    await removeEmployee();

    const employeesAfter = await viewEmployees();

    expect(employeesAfter.length).toBe(employeesBefore.length - 1);
  });

  // Add more employee-related test cases as needed
});
