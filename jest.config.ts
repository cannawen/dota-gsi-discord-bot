/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    clearMocks: true,
    preset: "ts-jest",
    setupFiles: ["<rootDir>/.jest/setEnvVars.ts"],
    setupFilesAfterEnv: ["<rootDir>/.jest/jest.setup.ts"],
    testEnvironment: "node",
};
