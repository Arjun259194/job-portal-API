// jest.ts.config.js
module.exports = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node", // Suitable for Node.js environments like Express
  testMatch: ["<rootDir>/src/**/*.test.ts"], // Only run tests in the src directory
  moduleFileExtensions: ["ts", "js"], // Allow importing both TS and JS if needed
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Use ts-jest to transform TypeScript
  },
};
