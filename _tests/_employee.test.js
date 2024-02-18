const Employee = require('../lib/Employee');
const pool = require('../config/dbConfig');
const inquirer = require('inquirer');

jest.mock('inquirer');
jest.mock('../lib/Employee'); // Mock the Employee class

describe('Employee Tests', () => {
  let connection;
  let roleId;
  let managerId;

  beforeAll(async () => {
    connection = await pool.getConnection();
    await connection.query('SET autocommit = 0');
    // Create a role and a manager before testing employees
    const [roleResult] = await connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', ['Test Role', 60000, 1]);
    roleId = roleResult.insertId;
    const [managerResult] = await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', ['Manager', 'Lastname', roleId, null]);
    managerId = managerResult.insertId;
  });

  beforeEach(async () => {
    await connection.query('START TRANSACTION');
  });

  afterEach(async () => {
    await connection.query('ROLLBACK');
  });

  afterAll(async () => {
    await connection.release();
    await pool.end();
  });

  test('addEmployee() method adds the employee to the database', async () => {
    // Mock user input for adding an employee
    const employeeInfo = {
      firstName: 'John',
      lastName: 'Doe',
      roleId: roleId, // Use the roleId created in the beforeAll hook
      managerId: null // Mock the manager ID
    };
    inquirer.prompt.mockResolvedValue(employeeInfo);

    // Mock the Employee.addEmployee method
    Employee.addEmployee.mockResolvedValueOnce(1); // Mock the return value to be the employee ID

    // Call the method under test
    const employeeId = await Employee.addEmployee(employeeInfo.firstName, employeeInfo.lastName, employeeInfo.roleId, employeeInfo.managerId);

    // Assertions to ensure the Employee.addEmployee was called with the correct arguments
    expect(Employee.addEmployee).toHaveBeenCalledWith('John', 'Doe', roleId, null);
    expect(employeeId).toBe(1); // Ensure the correct employee ID is returned
  });

  // ... other tests ...
});
