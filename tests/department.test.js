const { addDepartment, viewDepartments, removeDepartment } = require('../index');
const dbConfig = require('../config/dbConfig');

describe('Department Tests', () => {
  beforeAll(async () => {
    await dbConfig.connect();
  });

  afterAll(async () => {
    await dbConfig.close();
  });

  beforeEach(async () => {
    await dbConfig.resetDatabase();
  });

  test('Adding a department', async () => {
    const newDepartment = 'Test Department';

    await addDepartment(newDepartment);

    const departments = await viewDepartments();

    expect(departments).toContainEqual(
      expect.objectContaining({
        name: newDepartment,
      })
    );
  });

  test('Removing a department', async () => {
    const newDepartment = 'Test Department';

    await addDepartment(newDepartment);

    const departmentsBefore = await viewDepartments();

    await removeDepartment(departmentsBefore[0].id); // Assuming it's the first department

    const departmentsAfter = await viewDepartments();

    expect(departmentsAfter.length).toBe(departmentsBefore.length - 1);
  });

  // Add more department-related test cases as needed
});
