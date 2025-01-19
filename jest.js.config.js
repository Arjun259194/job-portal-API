// jest.js.config.js
module.exports = {
  verbose: true,
  testEnvironment: "node", // Suitable for Node.js environments
  testMatch: ["<rootDir>/build/**/*.test.js"], // Only run tests in the build directory
  moduleFileExtensions: ["js"], // Only test JavaScript files
};
