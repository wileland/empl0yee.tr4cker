-- Populate 'department' table with initial data.
INSERT INTO department (name) VALUES
('Engineering'),
('Human Resources'),
('Finance'),
('Marketing');

-- Populate 'role' table with initial data. 
-- Ensure that 'department_id' matches the ids of the inserted departments.
INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 70000, 1),
('HR Manager', 65000, 2),
('Accountant', 55000, 3),
('Marketing Coordinator', 48000, 4);

-- Populate 'employee' table with initial data.
-- 'role_id' should match the ids of the inserted roles.
-- 'manager_id' is NULL to start, but should match the ids of other employees if set.
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Emily', 'Johnson', 3, NULL),
('Michael', 'Brown', 4, NULL);
