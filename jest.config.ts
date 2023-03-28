/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
    setupFilesAfterEnv: ["<rootDir>/.jest/jest.setup.ts"],
    testEnvironment: "node",
    modulePathIgnorePatterns: ["helpers.ts"],
};
