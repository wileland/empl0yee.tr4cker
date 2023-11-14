INSERT INTO department (name, description) VALUES
('Engineering', 'Software development and IT support'),
('Human Resources', 'Employee relations, recruiting, and benefits'),
('Finance', 'Accounting, budgeting, and financial planning'),
('Marketing', 'Sales, marketing, and advertising');

INSERT INTO role (title, salary, department_id, required_skills) VALUES
('Software Engineer', 70000, 1, 'Java, Python, C++'),
('HR Manager', 65000, 2, 'Recruiting, employee relations, benefits administration'),
('Accountant', 55000, 3, 'Accounting software, financial reporting, budgeting'),
('Marketing Coordinator', 48000, 4, 'Social media marketing, email marketing, content creation');

INSERT INTO employee (first_name, last_name, role_id, manager_id, hire_date) VALUES
('John', 'Doe', 1, NULL, '2023-08-08'),
('Jane', 'Smith', 2, NULL, '2023-08-08'),
('Emily', 'Johnson', 3, NULL, '2023-08-08'),
('Michael', 'Brown', 4, NULL, '2023-08-08');