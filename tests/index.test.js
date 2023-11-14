// index.test.js

const cTable = require('console.table');


const { runEmployeeTracker } = require('../index');

test('Running Employee Tracker', () => {

  
  // Spy on console.log to check if specific messages are printed during the execution
  const spy = jest.spyOn(console, 'log');

  // Run the main application
  runEmployeeTracker();

  // Add assertions to check if console.log messages were called as expected
  // For example: expect(spy).toHaveBeenCalledWith('Connected to the database.');

  // Clean up the spy
  spy.mockRestore();
});

// You can add more test cases to simulate different user actions in the application
