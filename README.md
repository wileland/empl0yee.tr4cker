# empl0yee tr4cker App

## Description
The empl0yee tr4cker is a command-line application built with Node.js, leveraging Inquirer for interactive prompts and MySQL2 for database management. It allows business owners to effectively oversee and manage their company's organizational structure, including departments, roles, and employee data.

## Table of Contents
- [Description](#description)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Running the Application](#running-the-application)
  - [Functionality](#functionality)
- [Features](#features)
- [File Directory Structure](#file-directory-structure)
- [Database Schema](#database-schema)
- [Database Configuration](#database-configuration)
- [Tests](#tests)
- [Contributing](#contributing)
- [License](#license)
- [User Story](#user-story)
- [Acceptance Criteria](#acceptance-criteria)

## Getting Started

### Prerequisites
Before using the empl0yee tr4cker, ensure the following are installed:
- Node.js
- MySQL
- Inquirer (for collecting input from the command line)
- MySQL2 (to connect to your MySQL database)

### Installation
1. Clone the repository to your local machine:
   ```bash
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
View all departments, roles, and employees
Add new departments, roles, and employees
Update existing employee roles
View employees by department and manager
Features
Interactive command-line interface using Inquirer
Robust database management with MySQL2
Class-based structure for managing database operations
Graceful handling of database connections and shutdown
File Directory Structure
Below is the file directory structure of the empl0yee tr4cker App:

lua
Copy code
empl0yee_tr4cker/
├── config/
│   └── dbConfig.js
├── db/
│   ├── schema.sql
│   └── seeds.sql
├── lib/
│   ├── Department.js
│   ├── Employee.js
│   └── Role.js
├── node_modules/
├── tests/
│   ├── department.test.js
│   ├── employee.test.js
│   ├── index.test.js
│   └── role.test.js
├── utils/
│   └── queries.js
├── .gitignore
├── index.js
├── jest.config.js
├── package-lock.json
├── package.json
└── README.md
Database Schema
The MySQL database schema consists of the following tables:

department: with fields for id, name, and description
role: with fields for id, title, salary, department_id, and required_skills
employee: with fields for id, first_name, last_name, role_id, manager_id, and hire_date
Detailed field definitions are included in db/schema.sql.

Database Configuration
Configure the database connection in config/dbConfig.js. Follow the installation guide to set up your environment.

Tests
Run tests to validate the functionalities of the empl0yee tr4cker:

bash
Copy code
npm test
Contributing
Community contributions are welcome. For any suggestions or issues, please follow the contribution guidelines provided in CONTRIBUTING.md.

License
This project is licensed under the MIT License.

User Story
AS A business owner
I WANT to manage the departments, roles, and employees in my company effectively
SO THAT I can organize and plan my business efficiently.

Acceptance Criteria
GIVEN a command-line application that accepts user input

WHEN I start the application
THEN I am presented with options to view all departments, roles
, and employees, add a department, add a role, add an employee, and update an employee role.

WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department IDs.
WHEN I choose to view all roles
THEN I am presented with a formatted table showing the job title, role ID, the department that role belongs to, and the salary for that role.
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee IDs, first names, last names, job titles, departments, salaries, and managers that the employees report to.
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database.
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database.
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database.
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database.