const engine = {
    getSession: jest.fn(),
    getSessions: jest.fn(),
    deleteSession: jest.fn(),
    setFact: jest.fn(),
    getFactValue: jest.fn(),
    register: jest.fn(),
    startCoachingSession: jest.fn(),
};

export default engine;
