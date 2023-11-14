JavaScript
const { addRole, viewRoles, removeRole, updateRole, getRoleById, getRolesByDepartment } = require('../index');
const dbConfig = require('../config/dbConfig');

describe('Role Tests', () => {
  beforeAll(async () => {
    // Connect to the database before running the tests
    await dbConfig.connect();
  });

  afterEach(async () => {
    // Reset the database after each test
    await dbConfig.resetDatabase();
  });

  afterAll(async () => {
    // Close the database connection after all tests are done
    await dbConfig.close();
  });

  // Test that the addRole() method returns the ID of the newly created role.
  test('addRole() method returns the ID of the newly created role', async () => {
    // Define a new role to add
    const newRole = {
      title: 'Software Engineer',
      salary: 80000,
      department: 'Engineering',
    };

    // Add the new role to the database and get the ID of the newly created role
    const roleId = await addRole(newRole);

    // Assert that the roleId is a number
    expect(roleId).toBeGreaterThan(0);
  });

  // Test that the addRole() method adds the role to the database.
  test('addRole() method adds the role to the database', async () => {
    // Define a new role to add
    const newRole = {
      title: 'Test Role',
      salary: 60000,
      department: 'Test Department',
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

  // Test that the removeRole() method removes the role from the database.
  test('removeRole() method removes the role from the database', async () => {
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

  // Test that the removeRole() method returns a success message.
  test('removeRole() method returns a success message', async () => {
    // Define a new role to add
    const newRole = {
      title: 'Test Role',
      salary: 60000,
      department: 'Test Department',
    };

    // Add the new role to the database
    await addRole(newRole);

    // Remove the role from the database and get the response
    const response = await removeRole(newRole.id);

    // Assert that the response is a success message
    expect(response).toEqual('Role removed successfully!');
  });

  // Test that the updateRole() method updates the correct role.
  test('updateRole() method updates the correct role', async () => {
    // Define a new role to add
    const newRole = {
      title: 'Test Role',
      salary: 60000,
      department: 'Test Department',
    };

    // Add the new role to the database
    await addRole(newRole);

    // Update the role's salary
    await updateRole(newRole.id, { salary: 70000 });

    // Get the updated role
    const updatedRole = await getRoleById(newRole.id);

    // Assert that the role's salary has been updated
    expect(updatedRole.salary).toEqual(70000);