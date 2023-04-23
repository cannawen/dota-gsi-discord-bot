import rule from "../runePower";
import rules from "../../rules";

describe("power runes", () => {
    describe("not in game", () => {
        test("do nothing", () => {
            const results = getResults(rule, {
                [rules.assistant.runePower]: "PRIVATE",
                inGame: false,
                time: 3 * 2 * 60,
            });
            expect(results).toBeUndefined();
        });
    });

    describe("in game", () => {
        describe("time 0:00", () => {
            test("do nothing", () => {
                const results = getResults(rule, {
                    [rules.assistant.runePower]: "PRIVATE",
                    inGame: true,
                    time: 0,
                });
                expect(results).toBeUndefined();
            });
        });
        describe("time 4:00", () => {
            test("do not play rune sound", () => {
                const results = getResults(rule, {
                    [rules.assistant.runePower]: "PRIVATE",
                    inGame: true,
                    time: 4 * 60,
                });
                expect(results).toBeUndefined();
            });
        });
        describe("time 6:00", () => {
            test("play rune sound", () => {
                const results = getResults(rule, {
                    [rules.assistant.runePower]: "PRIVATE",
                    inGame: true,
                    time: 6 * 60,
                });
                expect(results).toContainFact(
                    "playPrivateAudio",
                    "resources/audio/rune-power.wav"
                );
            });
        });
        describe("time 60:00", () => {
            test("play rune sound", () => {
                const results = getResults(rule, {
                    [rules.assistant.runePower]: "PRIVATE",
                    inGame: true,
                    time: 60 * 60,
                });
                expect(results).toContainFact(
                    "playPrivateAudio",
                    "resources/audio/rune-power.wav"
                );
            });
        });
    });
});
