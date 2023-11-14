-- schema.sql

-- Drop existing tables if they exist
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

-- Create department table
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL  -- Increased the size for department names
);

-- Create role table
CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,  -- Increased the size for role titles
    salary DECIMAL(10, 2) NOT NULL,  -- Defined precision and scale for salary
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
    -- ON DELETE SET NULL means if a department is deleted, the role's department_id will be set to NULL
);

-- Create employee table
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,  -- Increased the size for first names
    last_name VARCHAR(50) NOT NULL,  -- Increased the size for last names
    role_id INT,
    manager_id INT NULL,  -- Allowed NULL for cases where an employee has no manager
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
    -- ON DELETE SET NULL means if a manager is deleted, the employee's manager_id will be set to NULL
);
