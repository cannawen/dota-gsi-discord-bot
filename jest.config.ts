/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    clearMocks: true,
    // This is needed so we do not test test.js files
    // Because the test.ts files are already being run
    modulePathIgnorePatterns: ["<rootDir>/build/.+test.js$"],
    preset: "ts-jest",
    setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
    setupFilesAfterEnv: ["<rootDir>/.jest/jest.setup.ts"],
    testEnvironment: "node",
};
