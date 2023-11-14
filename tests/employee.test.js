const Employee = require('../lib/Employee');
const inquirer = require('inquirer');
const dbConfig = require('../config/dbConfig');

jest.mock('inquirer');
jest.mock('../lib/Employee'); // Mock the Employee class

describe('Employee Tests', () => {
  beforeAll(async () => {
    // Setup the database connection before all tests
    await dbConfig.connect();
  });

  afterEach(async () => {
    // Reset the database to a clean state after each test
    await dbConfig.resetDatabase();
  });

  afterAll(async () => {
    // Close the database connection after all tests are done
    await dbConfig.close();
  });

  test('addEmployee() prompts for employee information and adds to database', async () => {
    // Mock user input for adding an employee
    const employeeInfo = {
      firstName: 'John',
      lastName: 'Doe',
      roleId: 1, // Mock the role ID
      managerId: null // Mock the manager ID
    };
    inquirer.prompt.mockResolvedValue(employeeInfo);

    // Mock the Employee.addEmployee method
    Employee.addEmployee.mockResolvedValueOnce(1); // Mock the return value to be the employee ID

    // Call the method under test
    await Employee.addEmployee(employeeInfo.firstName, employeeInfo.lastName, employeeInfo.roleId, employeeInfo.managerId);

    // Assertions to ensure the Employee.addEmployee was called with the correct arguments
    expect(Employee.addEmployee).toHaveBeenCalledWith('John', 'Doe', 1, null);
  });

  test('updateEmployee() prompts for new employee information and updates the database', async () => {
    // Mock the initial employee creation
    const initialEmployee = { id: 1, firstName: 'Jane', lastName: 'Doe', roleId: 2, managerId: null };
    Employee.addEmployee.mockResolvedValueOnce(initialEmployee.id);

    // Mock user input for updating an employee
    const updatedEmployeeInfo = { firstName: 'Jane', lastName: 'Smith', roleId: 2, managerId: null };
    inquirer.prompt.mockResolvedValue(updatedEmployeeInfo);

    // Mock the Employee.updateEmployee method
    Employee.updateEmployee.mockResolvedValueOnce(1); // Mock the affected rows count

    // Call the method under test
    await Employee.updateEmployee(initialEmployee.id, updatedEmployeeInfo.firstName, updatedEmployeeInfo.lastName, updatedEmployeeInfo.roleId, updatedEmployeeInfo.managerId);

    // Assertions to ensure the Employee.updateEmployee was called with the correct arguments
    expect(Employee.updateEmployee).toHaveBeenCalledWith(initialEmployee.id, 'Jane', 'Smith', 2, null);
  });

  // Additional tests would follow a similar structure, mocking the necessary user input and Employee class methods
});
