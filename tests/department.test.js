const Department = require('../lib/Department');
const pool = require('../config/dbConfig'); // Assuming this exports a pool object

describe('Department Tests', () => {
  let connection;

  beforeAll(async () => {
    connection = await pool.getConnection();
    await connection.query('SET autocommit = 0');
  });

  beforeEach(async () => {
    await connection.query('START TRANSACTION');
  });

  afterEach(async () => {
    await connection.query('ROLLBACK');
  });

  afterAll(async () => {
    await connection.release();
    await pool.end();
  });

  test('Adding a department', async () => {
    const newDepartmentName = 'Test Department';
    const departmentId = await Department.addDepartment(newDepartmentName);
    const addedDepartment = await Department.getDepartmentById(departmentId);

    expect(addedDepartment).toEqual(expect.objectContaining({
      name: newDepartmentName
    }));
  });

  test('Removing a department', async () => {
    const newDepartmentName = 'Test Department';
    const departmentId = await Department.addDepartment(newDepartmentName);
    
    await Department.removeDepartment(departmentId);
    const departments = await Department.viewDepartments();

    expect(departments).toEqual(expect.not.arrayContaining([
      expect.objectContaining({ id: departmentId })
    ]));
  });

  // Additional test cases...
});
