const engine = {
    getSession: jest.fn(),
    getSessions: jest.fn(),
    updateFact: jest.fn(),
    closeSession: jest.fn(),
    handleStartup: jest.fn(),
    register: jest.fn(),
    startCoachingSession: jest.fn(),
};

export default engine;
