/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    modulePathIgnorePatterns: ["helpers.ts"],
    preset: "ts-jest",
    setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
    setupFilesAfterEnv: ["<rootDir>/.jest/jest.setup.ts"],
    testEnvironment: "node",
};
