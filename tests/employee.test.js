const { addEmployee, viewEmployees, removeEmployee, updateEmployee, getEmployeeById, getEmployeesByDepartment, getEmployeesByManager } = require('../index');
const dbConfig = require('../config/dbConfig');
const inquirer = require('inquirer'); // Import the inquirer library

jest.mock('inquirer');

describe('Employee Tests', () => {
  beforeAll(async () => {
    await dbConfig.connect();
  });

  afterEach(async () => {
    await dbConfig.resetDatabase();
  });

  afterAll(async () => {
    await dbConfig.close();
  });

  // Test that the addEmployee() method calls the inquirer.prompt() method with the correct prompt.
  test('addEmployee() method calls the inquirer.prompt() method with the correct prompt', async () => {
    const employeeInfo = {
      firstName: 'John',
      lastName: 'Doe',
      role: 'Manager',
      department: 'HR',
    };

    // Mock inquirer to provide user input for adding an employee
    inquirer.prompt.mockResolvedValueOnce(employeeInfo);

    const spy = jest.spyOn(inquirer, 'prompt');

    await addEmployee();

    expect(spy).toHaveBeenCalledWith([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter the employee\'s first name:',
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter the employee\'s last name:',
      },
      {
        type:
 
'list',
        name: 'role',
        message: 'Select the employee\'s role:',
        choices: ['Manager', 'Employee'],
      },
      {
        type: 'list',
        name: 'department',
        message: 'Select the employee\'s department:',
        choices: ['HR', 'IT'],
      },
    ]);
  });

  // Test that the removeEmployee() method calls the inquirer.prompt() method with the correct prompt.
  test('removeEmployee() method calls the inquirer.prompt() method with the correct prompt', async () => {
    const employeeInfo = {
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'Employee',
      department: 'IT',
    };

    // Mock inquirer to provide user input for adding an employee
    inquirer.prompt.mockResolvedValueOnce(employeeInfo);

    await addEmployee(employeeInfo);

    const spy = jest.spyOn(inquirer, 'prompt');

    // Mock inquirer to provide user input for removing an employee
    inquirer.prompt.mockResolvedValueOnce({
      employeeId: 1, // Assuming it's the first employee
    });

    await removeEmployee();

    expect(spy).toHaveBeenCalledWith([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to remove:',
        choices: [1],
      },
    ]);
  });

  // Test that the updateEmployee() method updates the correct employee.
  test('updateEmployee() method updates the correct employee', async () => {
    const employeeInfo = {
      firstName: 'John',
      lastName: 'Doe',
      role: 'Manager',
      department: 'HR',
    };

    // Add an employee
    await addEmployee(employeeInfo);

    const employee = await getEmployeeById(1); // Assuming it's the first employee

    // Update the employee's first name
    await updateEmployee(1, { firstName: 'Jane' });

    const updatedEmployee = await getEmployeeById(1);

    expect(updatedEmployee.first_name).toEqual('Jane');
  });

  // Test that the getEmployeeById() method returns the correct employee.
  test('getEmployeeById() method returns the correct employee', async () => {
    const employeeInfo = {
      firstName: 'John',
      lastName: 'Doe',
      role: 'Manager',
      department: 'HR',
    };

    // Add an employee
    await addEmployee(employeeInfo);

    const employee = await getEmployeeById(1); // Assuming it's the first employee

    expect(employee.first_name).toEqual('John');
    expect(employee.last_name).toEqual('Doe');
    expect(employee.role).toEqual('Manager');
    expect(employee.department).toEqual('HR');
  });

  // Test that the getEmployeesByDepartment() method returns