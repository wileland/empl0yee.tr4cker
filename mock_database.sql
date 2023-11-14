CREATE TABLE users (
  id INT
 
NOT
 
NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT
 
NULL,
  email VARCHAR(255) NOT
 
NULL
 
UNIQUE
);

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  manager_id INT NOT NULL,
  FOREIGN KEY (manager_id) REFERENCES users (id)
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT
 
NULL,
  salary INT
 
NOT
 
NULL,
  department_id INT
 
NOT
 
NULL,
  FOREIGN KEY (department_id) REFERENCES departments (id)
);

CREATE
 
TABLE
 
employees (
  id INT
 
NOT
 
NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT
 
NULL,
  last_name VARCHAR(255) NOT
 
NULL,
  role_id INT
 
NOT
 
NULL,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES roles (id),
  FOREIGN KEY (manager_id) REFERENCES employees (id)
);