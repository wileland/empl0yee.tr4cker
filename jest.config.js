module.exports = {
  // Indicates that the root of the project is the current directory
  roots: ['./'],

  // Use TypeScript for test files
  preset: 'ts-jest',

  // A list of file extensions to include for tests
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',

  // Specify the environment for running tests
  testEnvironment: 'node',

  // Enable automatic clearing of mock calls and instances before each test
  clearMocks: true,

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: './coverage',

  // A list of paths to directories that Jest should use to search for files in
  moduleDirectories: ['node_modules', 'src'],

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],

  // An array of regex patterns that are matched against all test paths before executing the test
  transform: {
    '\\.ts$': 'ts-jest',
  },
};
