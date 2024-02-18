-- Start transaction
START TRANSACTION;

-- Clear existing data from the employee table
DELETE FROM employee;

-- Clear existing data from the role table
DELETE FROM role;

-- Clear existing data from the department table
DELETE FROM department;

-- Insert sample data into the department table
INSERT INTO department (id, name) VALUES
(1, 'Engineering'),
(2, 'Human Resources'),
(3, 'Finance'),
(4, 'Marketing');

-- Insert sample data into the role table
INSERT INTO role (id, title, salary, department_id) VALUES
(1, 'Software Engineer', 70000, 1),
(2, 'HR Manager', 65000, 2),
(3, 'Accountant', 55000, 3),
(4, 'Marketing Coordinator', 48000, 4);

-- Insert sample data into the employee table
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL),
(2, 'Jane', 'Smith', 2, NULL),
(3, 'Emily', 'Johnson', 3, NULL),
(4, 'Michael', 'Brown', 4, NULL);

-- Commit transaction
COMMIT;
