# Employee Tracker App

## Table of Contents
1. [Description](#1-description)
2. [Installation](#2-installation)
3. [Usage](#3-usage)
4. [Features](#4-features)
5. [Database Schema](#5-database-schema)
6. [Contributing](#6-contributing)
7. [License](#7-license)

## 1. Description
The Employee Tracker App is a command-line application built using Node.js, Inquirer, and MySQL2. It allows business owners to manage their company's employee database. Users can view and manage departments, roles, and employees, helping them organize and plan their business.

## 2. Installation
To run the Employee Tracker App, follow these steps:
1. Clone the repository to your local machine.
2. Navigate to the project directory using the terminal.
3. Install the required dependencies using the following command:
npm install
4. Create a MySQL database and configure the connection details in `config/dbConfig.js`.
5. Run the application using the following command:
node index.js

## 3. Usage
Once the application is running, you can use it to perform various tasks related to managing employee data, such as viewing departments, roles, and employees, adding new departments, roles, and employees, and updating employee roles.

## 4. Features
The Employee Tracker App provides the following core features:
- View all departments.
- View all roles.
- View all employees.
- Add a department.
- Add a role.
- Add an employee.
- Update an employee's role.
- Exit the application.

## 5. Database Schema
The app uses the following database schema:
- **department**
- id: INT PRIMARY KEY
- name: VARCHAR(30) to hold department name
- **role**
- id: INT PRIMARY KEY
- title: VARCHAR(30) to hold role title
- salary: DECIMAL to hold role salary
- department_id: INT to hold reference to department role belongs to
- **employee**
- id: INT PRIMARY KEY
- first_name: VARCHAR(30) to hold employee first name
- last_name: VARCHAR(30) to hold employee last name
- role_id: INT to hold reference to employee role
- manager_id: INT to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)

## 6. Contributing
Contributions are welcome! If you have suggestions or find issues with the app, please open an issue or submit a pull request.

## 7. License
This project is licensed under the [MIT License](LICENSE).
