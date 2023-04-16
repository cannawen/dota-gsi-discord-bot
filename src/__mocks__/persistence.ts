const persistence = {
    deleteRestartData: jest.fn(),
    saveRestartData: jest.fn(),
    readRestartData: jest.fn(),

    deleteStudentData: jest.fn(),
    saveStudentData: jest.fn(),
    readStudentData: jest.fn(),
};

export default persistence;
