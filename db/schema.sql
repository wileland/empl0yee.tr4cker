-- Use 'IF EXISTS' to prevent errors when the tables do not exist yet.
-- Drop tables in the reverse order of their creation due to foreign key constraints.

DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

-- Create 'department' table with an increased size for department names.
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Create 'role' table with a defined precision and scale for salary.
-- Foreign key on 'department_id' references 'id' in 'department' table.
CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL, 
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

-- Create 'employee' table with increased size for first and last names.
-- 'manager_id' can be NULL if there is no manager.
-- Foreign keys on 'role_id' and 'manager_id' reference 'id' in 'role' and 'employee' tables, respectively.
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id INT,
    manager_id INT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
