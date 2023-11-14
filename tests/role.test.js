const dbConfig = require('../config/dbConfig');

const { addRole, viewRoles } = require('../index');

test('Adding a role', async () => {
  // Define a new role for testing
  const newRole = {
    title: 'Software Engineer',
    salary: 80000,
    department: 'Engineering',
  };

  // Perform the test
  await addRole(newRole);

  // Check if the role was added successfully
  const roles = await viewRoles();

  // Add your assertions here to check if the new role information is in the result
  expect(roles).toContainEqual(
    expect.objectContaining({
      title: 'Software Engineer',
      salary: 80000,
      department: 'Engineering',
    })
  );
});

// Add more test cases for other role-related functions as needed
