import AppRunesHandler from "./AppRunesHandler";
import Constants from "./Constants";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logic = require("./logic");
jest.mock("./logic", () => jest.fn());

describe("ApRunesHandler", () => {
    let handler : AppRunesHandler;

    describe("IGsiTimeSubscriber.handleTime", () => {
        describe("logic returns audio key 1", () => {
            beforeEach(() => {
                logic.mockImplementation(() => Constants.RuneId.BOUNTY | Constants.RuneId.POWER);
                handler = new AppRunesHandler();
            });
            test("we called logic for 15 seconds in the future", () => {
                handler.handleTime(1);
                expect(logic).toHaveBeenCalledWith(16);
            });
            test("returns no side effect before or euqal to time 0", () => {
                expect(handler.handleTime(-1)).toHaveProperty("type", "NONE");
                expect(handler.handleTime(0)).toHaveProperty("type", "NONE");
            });
            test("should return tts side effect", () => {
                expect(handler.handleTime(1)).toStrictEqual({
                    data: "bounty_and_power_runes.wav",
                    type: "AUDIO_FILE",
                });
            });
        });

        describe("logic returns audio key 0", () => {
            beforeEach(() => {
                logic.mockImplementation(() => Constants.RuneId.NONE);
                handler = new AppRunesHandler();
            });
            test("should return no side effect", () => {
                expect(handler.handleTime(1)).toHaveProperty("type", "NONE");
            });
        });
    });
});
