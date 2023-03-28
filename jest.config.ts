/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    setupFilesAfterEnv: ["./jest.setup.ts"],
    testEnvironment: "node",
    modulePathIgnorePatterns: ["helpers.ts"],
};
