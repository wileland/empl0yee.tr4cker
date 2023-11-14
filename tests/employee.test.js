// employee.test.js

const dbConfig = require('../config/dbConfig');

const { addEmployee, viewEmployees } = require('../index');

test('Adding an employee', () => {
  // Define employee information for testing
  const employeeInfo = {
    firstName: 'John',
    lastName: 'Doe',
    role: 'Manager',
    department: 'HR',
  };

  // Perform the test (assuming addEmployee returns a Promise)
  return addEmployee(employeeInfo)
    .then(() => {
      // Check if the employee was added successfully
      return viewEmployees().then((employees) => {
        // Add your assertions here to check if the employee information is in the result
        // For example, you can expect employees to contain 'John Doe' and 'Manager' in this case
      });
    });
});

// Add more test cases for other employee-related functions as needed
