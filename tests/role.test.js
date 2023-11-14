// role.test.js

const cTable = require('console.table');


const { addRole, viewRoles } = require('../index');

test('Adding a role', () => {
  // Define role data for testing
  const newRole = {
    title: 'Test Role',
    salary: 50000,
    department: 'Test Department',
  };

  // Perform the test (assuming addRole returns a Promise)
  return addRole(newRole)
    .then(() => {
      // Check if the role was added successfully
      return viewRoles().then((roles) => {
        // Add assertions to check if the new role data is in the result
        // For example: expect(roles).toContain(newRole);
      });
    });
});

test('Viewing all roles', () => {
  // Perform the test (assuming viewRoles returns a Promise)
  return viewRoles().then((roles) => {
    // Check if roles is an array
    expect(Array.isArray(roles)).toBe(true);

    // You can add more specific assertions here based on the expected data
    // For example, check if a specific role title is present in the result
    expect(roles).toContain('Test Role');
    expect(roles).toContain('Developer');
  });
});

// Add more test cases for other role-related functions as needed
