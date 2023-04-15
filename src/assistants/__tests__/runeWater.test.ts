import { getResults } from "../../__tests__/helpers";
import rule from "../runeWater";
import rules from "../../rules";

describe("water runes", () => {
    describe("not in game", () => {
        test("do nothing", () => {
            const results = getResults(rule, {
                [rules.assistant.runeWater]: "PRIVATE",
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
                    [rules.assistant.runeWater]: "PRIVATE",
                    inGame: true,
                    time: 0,
                });
                expect(results).toBeUndefined();
            });
        });
        describe("time 2:00", () => {
            test("play rune sound", () => {
                const results = getResults(rule, {
                    [rules.assistant.runeWater]: "PRIVATE",
                    inGame: true,
                    time: 2 * 60,
                });
                expect(results).toContainFact(
                    "playPrivateAudioFile",
                    "resources/audio/rune-water.mp3"
                );
            });
        });
        describe("time 4:00", () => {
            test("play rune sound", () => {
                const results = getResults(rule, {
                    [rules.assistant.runeWater]: "PRIVATE",
                    inGame: true,
                    time: 4 * 60,
                });
                expect(results).toContainFact(
                    "playPrivateAudioFile",
                    "resources/audio/rune-water.mp3"
                );
            });
        });
        describe("time 6:00", () => {
            test("do not play rune sound", () => {
                const results = getResults(rule, {
                    [rules.assistant.runeWater]: "PRIVATE",
                    inGame: true,
                    time: 6 * 60,
                });
                expect(results).toBeUndefined();
            });
        });
    });
});
