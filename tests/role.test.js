// role.test.js

const dbConfig = require('../config/dbConfig');

const { addRole, viewRoles } = require('../index');

test('Adding a role', () => {
  // Define a new role for testing
  const newRole = {
    title: 'Software Engineer',
    salary: 80000,
    department: 'Engineering',
  };

  // Perform the test (assuming addRole returns a Promise)
  return addRole(newRole)
    .then(() => {
      // Check if the role was added successfully
      return viewRoles().then((roles) => {
        // Add your assertions here to check if the new role information is in the result
        // For example, you can expect roles to contain 'Software Engineer' and 'Engineering' in this case
      });
    });
});

// Add more test cases for other role-related functions as needed
