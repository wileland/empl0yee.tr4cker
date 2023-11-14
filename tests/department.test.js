// department.test.js

const cTable = require('console.table');

const { addDepartment, viewDepartments } = require('../index');

test('Adding a department', () => {
  // Define a new department name for testing
  const newDepartmentName = 'Test Department';

  // Perform the test (assuming addDepartment returns a Promise)
  return addDepartment(newDepartmentName)
    .then(() => {
      // Check if the department was added successfully
      return viewDepartments().then((departments) => {
        expect(departments).toContain(newDepartmentName);
      });
    });
});

test('Viewing all departments', () => {
  // Perform the test (assuming viewDepartments returns a Promise)
  return viewDepartments().then((departments) => {
    // Check if departments is an array
    expect(Array.isArray(departments)).toBe(true);
    
    // You can add more specific assertions here based on the expected data
    // For example, check if a specific department name is present in the result
    expect(departments).toContain('Department 1');
    expect(departments).toContain('Department 2');
    expect(departments).toContain('Department 3');
  });
});

// Add more test cases for other department-related functions as needed
