const { addDepartment, viewDepartments, removeDepartment } = require('../index');
const dbConfig = require('../config/dbConfig');

describe('Department Tests', () => {
  beforeAll(async () => {
    await dbConfig.connect();
  });

  afterEach(async () => {
    await dbConfig.resetDatabase();
  });

  afterAll(async () => {
    await dbConfig.close();
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
// Test that the getDepartmentById() method returns the correct department.
test('getDepartmentById() method returns the correct department', async () => {
  const newDepartment = 'Test Department';
  await addDepartment(newDepartment);

  const department = await getDepartmentById(1); // Assuming it's the first department

  expect(department).toBeDefined();
  expect(department.name).toEqual(newDepartment);
});

// Test that the updateDepartment() method updates the correct department.
test('updateDepartment() method updates the correct department', async () => {
  const newDepartment = 'Test Department';
  await addDepartment(newDepartment);

  await updateDepartment(1, 'Updated Test Department'); // Assuming it's the first department

  const department = await getDepartmentById(1);

  expect(department.name).toEqual('Updated Test Department');
});

// Test that the deleteDepartment() method deletes the correct department.
test('deleteDepartment() method deletes the correct department', async () => {
  const newDepartment = 'Test Department';
  await addDepartment(newDepartment);

  await deleteDepartment(1); // Assuming it's the first department

  const departments = await viewDepartments();

  expect(departments.length).toBe(0);
});

// Test that the addDepartment() method fails if the department name is already in use.
test('addDepartment() method fails if the department name is already in use', async () => {
  const newDepartment = 'Test Department';
  await addDepartment(newDepartment);

  expect(() => addDepartment(newDepartment)).toThrowError();
});

// Test that the removeDepartment() method fails if the department has employees assigned to it.
test('removeDepartment() method fails if the department has employees assigned to it', async () => {
  const newDepartment = 'Test Department';
  await addDepartment(newDepartment);

  await addEmployee('John Doe', newDepartment, 'Software Engineer');

  expect(() => removeDepartment(1)).toThrowError();
});
  // Test that the close() method properly releases the database connection
  test('close() method releases database connection', async () => {
    const department = new Department(pool);
    await department.close();

    expect(department.pool.connection).toBeNull();
  });
});