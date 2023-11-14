const { addDepartment, viewDepartments } = require('../index');

test('Adding a department', async () => {
  // Define a new department for testing
  const newDepartment = 'Test Department';

  // Perform the test by adding the department
  await addDepartment(newDepartment);

  // Check if the department was added successfully
  const departments = await viewDepartments();

  // Add your assertions here to check if the new department is in the result
  expect(departments).toContainEqual(
    expect.objectContaining({
      name: newDepartment,
    })
  );
});

// Add more test cases for other department-related functions as needed
