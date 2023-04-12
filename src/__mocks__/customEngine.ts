const engine = {
    cleanupSession: jest.fn(),
    handleStartup: jest.fn(),
    readyToPlayAudio: jest.fn(),
    register: jest.fn(),
    startCoachingSession: jest.fn(),
};

export default engine;
