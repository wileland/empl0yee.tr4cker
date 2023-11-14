// employee.test.js

const cTable = require('console.table');

const { addEmployee, viewEmployees } = require('../index');

test('Adding an employee', () => {
  // Define employee data for testing
  const newEmployee = {
    firstName: 'John',
    lastName: 'Doe',
    role: 'Test Role',
    manager: 'Test Manager',
  };

  // Perform the test (assuming addEmployee returns a Promise)
  return addEmployee(newEmployee)
    .then(() => {
      // Check if the employee was added successfully
      return viewEmployees().then((employees) => {
        // Add assertions to check if the new employee data is in the result
        // For example: expect(employees).toContain(newEmployee);
      });
    });
});

test('Viewing all employees', () => {
  // Perform the test (assuming viewEmployees returns a Promise)
  return viewEmployees().then((employees) => {
    // Check if employees is an array
    expect(Array.isArray(employees)).toBe(true);

    // You can add more specific assertions here based on the expected data
    // For example, check if a specific employee name is present in the result
    expect(employees).toContain('John Doe');
    expect(employees).toContain('Jane Smith');
  });
});

// Add more test cases for other employee-related functions as needed
