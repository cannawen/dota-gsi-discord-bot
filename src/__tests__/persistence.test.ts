jest.mock("fs");
jest.mock("../log");
import fs from "fs";
import sut from "../persistence";

describe("persistence", () => {
    const OLD_ENV = process.env;

    beforeAll(() => {
        process.env = { ...OLD_ENV, PERSISTENCE_DATA_PATH: "test" };
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test("saveRestartData", () => {
        const spy = jest.spyOn(fs, "writeFileSync");
        sut.saveRestartData("all data");
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.lastCall![0]).toBe("test/restartData.json");
        expect(spy.mock.lastCall![1]).toBe("all data");
    });

    describe("readRestartData", () => {
        test("no data", () => {
            expect(sut.readRestartData()).toBeUndefined();
        });
        test("check to see if restart data exists", () => {
            const spy = jest.spyOn(fs, "existsSync");
            sut.readRestartData();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.lastCall![0]).toBe("test/restartData.json");
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
                const mockReadFile = fs.readFileSync as jest.Mock;
                expect(mockReadFile).toHaveBeenCalledTimes(1);
                expect(mockReadFile.mock.lastCall[0]).toBe(
                    "test/restartData.json"
                );
                expect(mockReadFile.mock.lastCall[1]).toBe("utf8");
            });
            test("should return read data", () => {
                expect(result).toBe("hello world");
            });
            test("should delete file", () => {
                const mockUnlink = fs.unlinkSync as jest.Mock;
                expect(mockUnlink).toHaveBeenCalledTimes(1);
                expect(mockUnlink.mock.lastCall[0]).toBe(
                    "test/restartData.json"
                );
            });
        });
    });
});
