import Constants from "./Constants";
import RunesPlugin from "./RunesPlugin";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logic = require("./logic");
jest.mock("./logic", () => jest.fn());

describe("RunesPlugin", () => {
    let sut : RunesPlugin;

    describe("GsiGameStateObserver.handleTime", () => {
        describe("logic returns audio key 1", () => {
            beforeEach(() => {
                logic.mockImplementation(() => Constants.RuneId.BOUNTY | Constants.RuneId.POWER);
                sut = new RunesPlugin();
            });
            test("we called logic for 15 seconds in the future", () => {
                sut.handleTime(1);
                expect(logic).toHaveBeenCalledWith(16);
            });
            test("returns no side effect before or euqal to time 0", () => {
                expect(sut.handleTime(-1)).toBeUndefined();
                expect(sut.handleTime(0)).toBeUndefined();
            });
            test("should return audio side effect", () => {
                const sideEffectInfo = sut.handleTime(1);
                // TODO remove
                expect(5).toBeWithinRange(3, 6);
                expect(sideEffectInfo).toBeAudio("bounty_and_power_runes.wav");
            });
        });

        describe("logic returns audio key 0", () => {
            beforeEach(() => {
                logic.mockImplementation(() => Constants.RuneId.NONE);
                sut = new RunesPlugin();
            });
            test("should return no side effect", () => {
                expect(sut.handleTime(1)).toBeUndefined();
            });
        });
    });
});
