import AppRunesLogic from "./AppRunesLogic";
import Constants from "./Constants";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logic = require("./logic");
jest.mock("./logic", () => jest.fn());

describe("AppRunesLogic", () => {
    let sut : AppRunesLogic;

    describe("IGsiGameStateObserver.handleTime", () => {
        describe("logic returns audio key 1", () => {
            beforeEach(() => {
                logic.mockImplementation(() => Constants.RuneId.BOUNTY | Constants.RuneId.POWER);
                sut = new AppRunesLogic();
            });
            test("we called logic for 15 seconds in the future", () => {
                sut.handleTime(1);
                expect(logic).toHaveBeenCalledWith(16);
            });
            test("returns no side effect before or euqal to time 0", () => {
                expect(sut.handleTime(-1)).toHaveProperty("type", "NONE");
                expect(sut.handleTime(0)).toHaveProperty("type", "NONE");
            });
            test("should return tts side effect", () => {
                expect(sut.handleTime(1)).toStrictEqual({
                    data: "bounty_and_power_runes.wav",
                    type: "AUDIO_FILE",
                });
            });
        });

        describe("logic returns audio key 0", () => {
            beforeEach(() => {
                logic.mockImplementation(() => Constants.RuneId.NONE);
                sut = new AppRunesLogic();
            });
            test("should return no side effect", () => {
                expect(sut.handleTime(1)).toHaveProperty("type", "NONE");
            });
        });
    });
});
