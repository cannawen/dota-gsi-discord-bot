const engine = {
    getSession: jest.fn(),
    getSessions: jest.fn(),
    setData: jest.fn(),
    getData: jest.fn(),
    closeSession: jest.fn(),
    handleStartup: jest.fn(),
    register: jest.fn(),
    startCoachingSession: jest.fn(),
};

export default engine;
