-- seeds.sql

-- Inserting sample data into the department table
INSERT INTO department (name)
VALUES 
('Engineering'),
('Human Resources'),
('Finance'),
('Marketing');

-- Inserting sample data into the role table
-- Note: Make sure the department_id corresponds to the ids in your department table
INSERT INTO role (title, salary, department_id)
VALUES 
('Software Engineer', 70000, 1),
('HR Manager', 65000, 2),
('Accountant', 55000, 3),
('Marketing Coordinator', 48000, 4);

-- Inserting sample data into the employee table
-- Note: Make sure the role_id and manager_id correspond to the ids in your role and employee tables
-- For simplicity, manager_id is set to NULL for now
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Emily', 'Johnson', 3, NULL),
('Michael', 'Brown', 4, NULL);
