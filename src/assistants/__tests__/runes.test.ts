import { getResults } from "../../__tests__/helpers";
import runesRule from "../runes";

describe("runes", () => {
    describe("not in game", () => {
        test("do nothing", () => {
            const results = getResults(runesRule, {
                inGame: false,
                time: 3 * 2 * 60,
            });
            expect(results).toBeUndefined();
        });
    });

    describe("in game", () => {
        describe("time 0:00", () => {
            test("do nothing", () => {
                const results = getResults(runesRule, {
                    inGame: true,
                    time: 0,
                });
                expect(results).toBeUndefined();
            });
        });
        describe("time 2:00", () => {
            test("play rune sound", () => {
                const results = getResults(runesRule, {
                    inGame: true,
                    time: 2 * 60,
                });
                expect(results).toContainFact(
                    "playPrivateAudioFile",
                    "resources/audio/rune-sound.mp3"
                );
            });
        });
        describe("time 3:00", () => {
            test("play rune sound", () => {
                const results = getResults(runesRule, {
                    inGame: true,
                    time: 3 * 60,
                });
                expect(results).toContainFact(
                    "playPrivateAudioFile",
                    "resources/audio/rune-sound.mp3"
                );
            });
        });
        describe("time 6:00", () => {
            test("play rune sound", () => {
                const results = getResults(runesRule, {
                    inGame: true,
                    time: 3 * 60,
                });
                expect(results).toContainFact(
                    "playPrivateAudioFile",
                    "resources/audio/rune-sound.mp3"
                );
            });
        });
    });
});
