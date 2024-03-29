jest.mock("fs");
jest.mock("../log");
import fs from "fs";
import sut from "../persistence";

describe("persistence", () => {
    test("deleteRestartData", () => {
        sut.deleteRestartData();
        expect(fs.unlinkSync).toHaveBeenCalledWith(
            "test_PERSISTENCE_DATA_PATH/restartData.json"
        );
    });

    test("saveRestartData", () => {
        sut.saveRestartData("all data");
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            "test_PERSISTENCE_DATA_PATH/restartData.json",
            "all data"
        );
    });

    describe("readRestartData", () => {
        test("no data", () => {
            expect(sut.readRestartData()).toBeUndefined();
        });
        test("check to see if restart data exists", () => {
            sut.readRestartData();
            expect(fs.existsSync).toHaveBeenCalledWith(
                "test_PERSISTENCE_DATA_PATH/restartData.json"
            );
        });
        test("does not exist", () => {
            (fs.existsSync as jest.Mock).mockReturnValue(false);
            const result = sut.readRestartData();
            expect(fs.readFileSync).not.toHaveBeenCalled();
            expect(result).toBeUndefined();
        });
        describe("exists", () => {
            let result: string | undefined;
            beforeEach(() => {
                (fs.existsSync as jest.Mock).mockReturnValue(true);
                (fs.readFileSync as jest.Mock).mockReturnValue("hello world");
                result = sut.readRestartData();
            });
            test("should read file", () => {
                expect(fs.readFileSync).toHaveBeenCalledWith(
                    "test_PERSISTENCE_DATA_PATH/restartData.json",
                    "utf8"
                );
            });
            test("should return read data", () => {
                expect(result).toBe("hello world");
            });
            test("should delete file", () => {
                expect(fs.unlinkSync).toHaveBeenCalledWith(
                    "test_PERSISTENCE_DATA_PATH/restartData.json"
                );
            });
        });
    });

    test("deleteStudentData", () => {
        sut.deleteStudentData("studentId");
        expect(fs.unlinkSync).toHaveBeenCalledWith(
            "test_PERSISTENCE_DATA_PATH/student/studentId.json"
        );
    });

    describe("save student data", () => {
        describe("student directory does not exist", () => {
            test("makes directory", () => {
                (fs.existsSync as jest.Mock).mockReturnValue(false);
                sut.saveStudentData("studentId", "data");
                expect(fs.mkdirSync).toHaveBeenCalledWith(
                    "test_PERSISTENCE_DATA_PATH/student",
                    {
                        recursive: true,
                    }
                );
            });
        });
        describe("student directory does exist", () => {
            test("does not makes directory", () => {
                (fs.existsSync as jest.Mock).mockReturnValue(true);
                sut.saveStudentData("studentId", "data");
                expect(fs.mkdirSync).not.toHaveBeenCalled();
            });
        });
        test("writes to student file", () => {
            sut.saveStudentData("studentId", "data");
            expect(fs.writeFileSync).toHaveBeenCalledWith(
                "test_PERSISTENCE_DATA_PATH/student/studentId.json",
                "data"
            );
        });
    });

    describe("readStudentData", () => {
        let mockExist: jest.Mock;
        let mockReadFile: jest.Mock;
        let result: string | undefined;
        beforeEach(() => {
            mockExist = fs.existsSync as jest.Mock;
            mockReadFile = fs.readFileSync as jest.Mock;
            mockReadFile.mockReturnValue("data");
        });
        test("check to see if file exists", () => {
            sut.readStudentData("studentId");
            expect(mockExist).toHaveBeenCalledWith(
                "test_PERSISTENCE_DATA_PATH/student/studentId.json"
            );
        });

        describe("file exists", () => {
            beforeEach(() => {
                mockExist.mockReturnValue(true);
                result = sut.readStudentData("studentId");
            });
            test("read student file", () => {
                expect(mockReadFile).toHaveBeenCalledWith(
                    "test_PERSISTENCE_DATA_PATH/student/studentId.json",
                    "utf8"
                );
                expect(result).toBe("data");
            });
        });

        describe("file does not exist", () => {
            beforeEach(() => {
                mockExist.mockReturnValue(false);
                result = sut.readStudentData("studentId");
            });
            test("does not read data and returns undefined", () => {
                expect(mockReadFile).not.toHaveBeenCalled();
                expect(result).toBeUndefined();
            });
        });
    });
});
