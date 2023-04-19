const fs = {
    existsSync: jest.fn().mockReturnValue(true),
    mkdirSync: jest.fn(),
    readFileSync: jest.fn(),
    readdirSync: jest.fn().mockReturnValue([]),
    stat: jest.fn(),
    unlinkSync: jest.fn(),
    writeFileSync: jest.fn(),
};

module.exports = fs;
