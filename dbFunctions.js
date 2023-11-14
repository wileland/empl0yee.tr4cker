const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to view all departments
const viewDepartments = async () => {
  const connection = await dbConfig.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM department ORDER BY id');
    return rows;
  } finally {
    connection.release();
  }
};

// Function to view all roles
const viewRoles = async () => {
  const connection = await dbConfig.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM role ORDER BY id');
    return rows;
  } finally {
    connection.release();
  }
};

// Function to view all employees
const viewEmployees = async () => {
  const connection = await dbConfig.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM employee ORDER BY id');
    return rows;
  } finally {
    connection.release();
  }
};

// Function to add a department
const addDepartment = async (name) => {
  const connection = await dbConfig.getConnection();
  try {
    const [results] = await connection.query('INSERT INTO department (name) VALUES (?)', [name]);
    return results.insertId; // Return the ID of the newly inserted department
  } finally {
    connection.release();
  }
};

// Function to add a role
const addRole = async (title, salary, departmentId) => {
  const connection = await dbConfig.getConnection();
  try {
    const [results] = await connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
    return results.insertId; // Return the ID of the newly inserted role
  } finally {
    connection.release();
  }
};

// Function to add an employee
const addEmployee = async (firstName, lastName, roleId, managerId) => {
  const connection = await dbConfig.getConnection();
  try {
    const [results] = await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
    return results.insertId; // Return the ID of the newly inserted employee
  } finally {
    connection.release();
  }
};

// Function to update a department's name
const updateDepartment = async (id, newName) => {
  const connection = await dbConfig.getConnection();
  try {
    const [results] = await connection.query('UPDATE department SET name = ? WHERE id = ?', [newName, id]);
    return results.affectedRows > 0; // Return true if the update was successful
  } finally {
    connection.release();
  }
};

// Function to update a role's details
const updateRole = async (id, newTitle, newSalary, newDepartmentId) => {
  const connection = await dbConfig.getConnection();
  try {
    const [results] = await connection.query('UPDATE role SET title = ?, salary = ?, department_id = ? WHERE id = ?', [newTitle, newSalary, newDepartmentId, id]);
    return results.affectedRows > 0; // Return true if the update was successful
  } finally {
    connection.release();
  }
};

// Function to update an employee's details (first name, last name, or manager)
const updateEmployee = async (id, newFirstName, newLastName, newRoleId, newManagerId) => {
  const connection = await dbConfig.getConnection();
  try {
    const [results] = await connection.query('UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE id = ?', [newFirstName, newLastName, newRoleId, newManagerId, id]);
    return results.affectedRows > 0; // Return true if the update was successful
  } finally {
    connection.release();
  }
};

// Function to delete a department
const deleteDepartment = async (id) => {
  const connection = await dbConfig.getConnection();
  try {
    const [results] = await connection.query('DELETE FROM department WHERE id = ?', [id]);
    return results.affectedRows > 0; // Return true if the delete was successful
  } finally {
    connection.release();
  }
};

// Function to delete a role
const deleteRole = async (id) => {
  const connection = await dbConfig.getConnection();
  try {
    const [results] = await connection.query('DELETE FROM role WHERE id = ?', [id]);
    return results.affectedRows > 0; // Return true if the delete was successful
  } finally {
    connection.release();
  }
};

// Function to delete an employee
const deleteEmployee = async (id) => {
  const connection = await dbConfig.getConnection();
  try {
    const [results] = await connection.query('DELETE FROM employee WHERE id = ?', [id]);
    return results.affectedRows > 0; // Return true if the delete was successful
  } finally {
    connection.release();
  }
};

module.exports = {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateDepartment,
  updateRole,
  updateEmployee,
  deleteDepartment,
  deleteRole,
  deleteEmployee,
};
