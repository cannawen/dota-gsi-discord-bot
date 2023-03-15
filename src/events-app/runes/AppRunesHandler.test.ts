import AppRunesHandler from "./AppRunesHandler";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import Constants from "./Constants";
const logic = require("./logic");
jest.mock("./logic", () => jest.fn());

describe("ApRunesHandler", () => {
    let handler : AppRunesHandler;

    describe("IGsiTimeSubscriber.handleTime", () => {
        describe("logic returns audio key 1", () => {
            beforeEach(() => {
                logic.mockImplementation((time: number) => Constants.RuneId.BOUNTY | Constants.RuneId.POWER);
                handler = new AppRunesHandler();
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
            test("when called multiple times for the same time, should not return side effect on second call", () => {
                handler.handleTime(1);
                expect(handler.handleTime(1)).toHaveProperty("type", "NONE");
            });
        });

        describe("logic returns audio key 0", () => {
            beforeEach(() => {
                logic.mockImplementation((time: number) => Constants.RuneId.NONE);
                handler = new AppRunesHandler();
            });
            test("should return no side effect", () => {
                expect(handler.handleTime(1)).toHaveProperty("type", "NONE");
            });
        });
    });
});
