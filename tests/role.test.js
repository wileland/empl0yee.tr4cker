const Role = require('../lib/Role');
const pool = require('../config/dbConfig');

describe('Role Tests', () => {
  let connection;
  let departmentId;

  beforeAll(async () => {
    connection = await pool.getConnection();
    await connection.query('SET autocommit = 0');
    // Create a department before testing roles
    const [result] = await connection.query('INSERT INTO department (name) VALUES (?)', ['Test Department']);
    departmentId = result.insertId;
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

  test('addRole() method adds the role to the database', async () => {
    const newRole = { title: 'Test Role', salary: 60000, departmentId: departmentId };
    const roleId = await Role.addRole(newRole.title, newRole.salary, newRole.departmentId);
    const addedRole = await Role.getRoleById(roleId);

    expect(addedRole).toEqual(expect.objectContaining(newRole));
  });

  // ... other tests ...
});
