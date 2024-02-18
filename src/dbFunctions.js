// dbFunctions.js
import { db } from './utils/queries.js'; // Import the db object from queries.js

// Function to get department choices
export const getDepartmentsForChoices = async () => {
  const departments = await viewAllDepartments(); // Assuming you have implemented the viewAllDepartments function
  return departments.map((department) => ({
    name: department.name,
    value: department.id,
  }));
};

// Function to get employee choices
export const getEmployeesForChoices = async () => {
  const employees = await viewAllEmployees(); // Assuming you have implemented the viewAllEmployees function
  return employees.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
};

// Function to get role choices
export const getRolesForChoices = async () => {
  const roles = await viewAllRoles(); // Assuming you have implemented the viewAllRoles function
  return roles.map((role) => ({
    name: role.title,
    value: role.id,
  }));
};

// Function to view all departments
export const viewAllDepartments = async () => {
  return await db.select('SELECT * FROM department ORDER BY id');
};

// Function to view all roles
export const viewAllRoles = async () => {
  return await db.select('SELECT * FROM role ORDER BY id');
};

// Function to view all employees
export const viewAllEmployees = async () => {
  return await db.select(`
    SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
    ORDER BY e.id
  `);
};

// Function to add a new department
export const addDepartment = async (name) => {
  if (!name) {
    throw new Error('Department name cannot be null');
  }
  return await db.execute('INSERT INTO department (name) VALUES (?)', [name]);
};


// Function to add a new role
export const addRole = async (title, salary, departmentId) => {
  return await db.execute('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
};

// Function to add a new employee
export const addEmployee = async (firstName, lastName, roleId, managerId) => {
  return await db.execute('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
};

// Function to update an employee's role
export const updateEmployeeRole = async (employeeId, roleId) => {
  return await db.execute('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
};

// Function to delete an employee
export const deleteEmployee = async (employeeId) => {
  return await db.execute('DELETE FROM employee WHERE id = ?', [employeeId]);
};
