const mockLogin = jest.fn().mockImplementation(() => ({
    catch: jest.fn(),
}));
const mockOn = jest.fn();
const mockOnce = jest.fn();

const discordjs = jest.createMockFromModule("discord.js") as any;

discordjs.Client = jest.fn().mockImplementation(() => ({
    login: mockLogin,
    on: mockOn,
    once: mockOnce,
}));

discordjs.Events = jest.fn();

module.exports = discordjs;
