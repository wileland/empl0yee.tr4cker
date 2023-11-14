empl0yee tr4cker App

empl0yee tr4cker is a command-line application built with Node.js, leveraging Inquirer for interactive prompts and MySQL2 for database management, allowing business owners to effectively oversee their company's employee database. With this application, users can interactively manage departments, roles, and employee data, streamlining business organization and planning processes.

Table of Contents
Description
Getting Started
Prerequisites
Installation
Usage
Running the Application
Functionality
Features
File Directory Structure
Database Schema
Database Configuration
Tests
Contributing
License
Description
The empl0yee tr4cker App is designed to facilitate the management of departments, roles, and employees via a command-line interface. It assists users in organizing and planning their business by providing structured and interactive access to their organizational data.

Getting Started
Prerequisites
Before using the empl0yee tr4cker, you must install:

Node.js
MySQL
Inquirer for collecting input from the command line
MySQL2 to connect to your MySQL database
Installation
Clone the repository to your local machine:
bash
Copy code
git clone <repository-url>
Navigate to the project directory in the terminal:
bash
Copy code
cd employee-tracker
Install the required dependencies (including Inquirer and MySQL2):
bash
Copy code
npm install
Create a MySQL database using the schema provided in db/schema.sql.
Configure your database connection details in config/dbConfig.js with your personal credentials.
Usage
Running the Application
Make sure your MySQL server is running.
Update config/dbConfig.js with your MySQL credentials:
javascript
Copy code
const dbConfig = {
  host: 'your-hostname',
  user: 'your-username',
  password: 'your-password',
  database: 'your-database-name',
};
Save your changes and start the application:
bash
Copy code
npm start
Functionality
With the empl0yee tr4cker App, you can:

View all departments, roles, and employees
Add new departments, roles, and employees
Update existing employee roles
View employees by department and manager
Features
Interactive command-line interface using Inquirer
Robust database management with MySQL2
Add, view, and remove departments, roles, and employees
Update employee roles
Exit the application
File Directory Structure
Below is the file directory structure of the empl0yee tr4cker App:

lua
Copy code
empl0yee_tr4cker
│
├── config
│   ├── connection.js
│   └── dbConfig.js
│
├── coverage
│   ├── lcov-report (folder)
│   ├── clover.xml
│   ├── coverage-final.json
│   └── lcov.info
│
├── db
│   ├── schema.sql
│   └── seeds.sql
│
├── lib
│   ├── Department.js
│   ├── Employee.js
│   └── Role.js
│
├── node_modules (folder)
│
├── tests
│   ├── department.test.js
│   ├── employee.test.js
│   ├── index.test.js
│   └── role.test.js
│
├── utils
│   └── queries.js
│
├── .gitignore
├── index.js
├── jest.config.js
├── package-lock.json
├── package.json
└── README.md
Database Schema
The MySQL database schema consists of the following tables:

department: with fields for id and name
role: with fields for id, title, salary, and department_id
employee: with fields for id, first_name, last_name, role_id, and manager_id
Detailed field definitions are included in db/schema.sql.

Database Configuration
The database connection can be configured in config/dbConfig.js. Follow the installation guide to set up your environment.

Tests
To run tests and validate the functionalities of the empl0yee tr4cker, execute the following command:

bash
Copy code
npm test
Contributing
Community contributions are encouraged. For any suggestions or issues, please follow the contribution guidelines provided in CONTRIBUTING.md.

License
This project is licensed under the MIT License.

User Story
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
Acceptance Criteria
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database