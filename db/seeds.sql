-- seeds.sql
-- Seed data for the Employee Tracker application

-- Start transaction
START TRANSACTION;

-- Inserting sample data into the department table
INSERT INTO department (id, name, description) VALUES
(1, 'Engineering', 'Software development and IT support'),
(2, 'Human Resources', 'Employee relations, recruiting, and benefits'),
(3, 'Finance', 'Accounting, budgeting, and financial planning'),
(4, 'Marketing', 'Sales, marketing, and advertising');

-- Inserting sample data into the role table
-- The department_id is set explicitly based on the known IDs from the department insertions
INSERT INTO role (title, salary, department_id, required_skills) VALUES
('Software Engineer', 70000, 1, 'Java, Python, C++'),
('HR Manager', 65000, 2, 'Recruiting, employee relations, benefits administration'),
('Accountant', 55000, 3, 'Accounting software, financial reporting, budgeting'),
('Marketing Coordinator', 48000, 4, 'Social media marketing, email marketing, content creation');

-- Inserting sample data into the employee table
-- For simplicity, manager_id is set to NULL for now
-- The hire_date is set to a fixed date for sample purposes
INSERT INTO employee (first_name, last_name, role_id, manager_id, hire_date) VALUES
('John', 'Doe', 1, NULL, '2023-08-08'),
('Jane', 'Smith', 2, NULL, '2023-08-08'),
('Emily', 'Johnson', 3, NULL, '2023-08-08'),
('Michael', 'Brown', 4, NULL, '2023-08-08');

-- Commit transaction
COMMIT;
