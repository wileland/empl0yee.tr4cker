const dbConfig = require('../config/dbConfig');

const { addEmployee, viewEmployees } = require('../index');

test('Adding an employee', async () => {
  // Define employee information for testing
  const employeeInfo = {
    firstName: 'John',
    lastName: 'Doe',
    role: 'Manager',
    department: 'HR',
  };

  // Perform the test
  await addEmployee(employeeInfo);

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
