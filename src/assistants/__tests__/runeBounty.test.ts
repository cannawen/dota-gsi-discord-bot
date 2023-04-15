import { getResults } from "../../__tests__/helpers";
import rule from "../runeBounty";
import rules from "../../rules";

describe("bounty runes", () => {
    describe("not in game", () => {
        test("do nothing", () => {
            const results = getResults(rule, {
                [rules.assistant.runeBounty]: "PRIVATE",
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
                    [rules.assistant.runeBounty]: "PRIVATE",
                    inGame: true,
                    time: 0,
                });
                expect(results).toBeUndefined();
            });
        });
        describe("time 3:00", () => {
            test("play rune sound", () => {
                const results = getResults(rule, {
                    [rules.assistant.runeBounty]: "PRIVATE",
                    inGame: true,
                    time: 3 * 60,
                });
                expect(results).toContainFact(
                    "playPrivateAudioFile",
                    "resources/audio/rune-bounty.wav"
                );
            });
        });
        describe("time 60:00", () => {
            test("play rune sound", () => {
                const results = getResults(rule, {
                    [rules.assistant.runeBounty]: "PRIVATE",
                    inGame: true,
                    time: 60 * 60,
                });
                expect(results).toContainFact(
                    "playPrivateAudioFile",
                    "resources/audio/rune-bounty.wav"
                );
            });
        });
    });
});
