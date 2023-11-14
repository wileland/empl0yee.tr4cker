const { addRole, viewRoles, removeRole } = require('../index');
const dbConfig = require('../config/dbConfig');

describe('Role Tests', () => {
  beforeAll(async () => {
    await dbConfig.connect();
  });

  afterAll(async () => {
    await dbConfig.close();
  });

  beforeEach(async () => {
    await dbConfig.resetDatabase();
  });

  test('Adding a role', async () => {
    const newRole = {
      title: 'Software Engineer',
      salary: 80000,
      department: 'Engineering',
    };

    await addRole(newRole);

    const roles = await viewRoles();

    expect(roles).toContainEqual(
      expect.objectContaining({
        title: 'Software Engineer',
        salary: 80000,
        department: 'Engineering',
      })
    );
  });

  test('Removing a role', async () => {
    const newRole = {
      title: 'Test Role',
      salary: 60000,
      department: 'Test Department',
    };

    await addRole(newRole);

    const rolesBefore = await viewRoles();

    await removeRole(rolesBefore[0].id); // Assuming it's the first role

    const rolesAfter = await viewRoles();

    expect(rolesAfter.length).toBe(rolesBefore.length - 1);
  });

  // Add more role-related test cases as needed
});
