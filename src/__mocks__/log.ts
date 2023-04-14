/* eslint-disable sort-keys */
const log = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    http: jest.fn(),
    verbose: jest.fn(),
    debug: jest.fn(),
    silly: jest.fn(),
    padToWithColor: jest.fn(),
};

export default log;
