const { addRole, viewRoles, removeRole } = require('../index');
const dbConfig = require('../config/dbConfig');

describe('Role Tests', () => {
  beforeAll(async () => {
    // Connect to the database before running the tests
    await dbConfig.connect();
  });

  afterAll(async () => {
    // Close the database connection after all tests are done
    await dbConfig.close();
  });

  beforeEach(async () => {
    // Reset the database before each test
    await dbConfig.resetDatabase();
  });

  test('Adding a role should add the role to the database', async () => {
    // Define a new role to add
    const newRole = {
      title: 'Software Engineer',
      salary: 80000,
      department: 'Engineering',
    };

    // Add the new role to the database
    await addRole(newRole);

    // Retrieve all roles from the database
    const roles = await viewRoles();

    // Assert that the new role is in the list of roles
    expect(roles).toContainEqual(
      expect.objectContaining({
        title: newRole.title,
        salary: newRole.salary,
        department: newRole.department,
      })
    );
  });

  test('Removing a role should remove the role from the database', async () => {
    // Define a new role to add
    const newRole = {
      title: 'Test Role',
      salary: 60000,
      department: 'Test Department',
    };

    // Add the new role to the database
    await addRole(newRole);

    // Retrieve all roles before removing
    const rolesBefore = await viewRoles();

    // Remove the role from the database (assuming it's the first role)
    await removeRole(rolesBefore[0].id);

    // Retrieve all roles after removing
    const rolesAfter = await viewRoles();

    // Assert that the number of roles after removal is one less than before
    expect(rolesAfter.length).toBe(rolesBefore.length - 1);
  });

  // Add more role-related test cases as needed

});
