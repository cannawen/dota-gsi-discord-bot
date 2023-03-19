import Constants from "./Constants";
import Runes from "./Runes";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logic = require("./logic");
jest.mock("./logic", () => jest.fn());

describe("Runes", () => {
    let sut : Runes;

    describe("GsiGameStateObserver.handleTime", () => {
        describe("logic returns audio key 1", () => {
            beforeEach(() => {
                logic.mockImplementation(() => Constants.RuneId.BOUNTY | Constants.RuneId.POWER);
                sut = new Runes();
            });
            test("we called logic for 15 seconds in the future", () => {
                sut.handleTime(1);
                expect(logic).toHaveBeenCalledWith(16);
            });
            test("returns no side effect before or euqal to time 0", () => {
                expect(sut.handleTime(-1)).toBeFalsy();
                expect(sut.handleTime(0)).toBeFalsy();
            });
            test("should return audio side effect", () => {
                expect(sut.handleTime(1)).toBe("bounty_and_power_runes.wav");
            });
        });

        describe("logic returns audio key 0", () => {
            beforeEach(() => {
                logic.mockImplementation(() => Constants.RuneId.NONE);
                sut = new Runes();
            });
            test("should return no side effect", () => {
                expect(sut.handleTime(1)).toBeFalsy();
            });
        });
    });
});
