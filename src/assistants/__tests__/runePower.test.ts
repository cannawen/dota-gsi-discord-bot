import rule from "../runePower";
import rules from "../../rules";

const params = {
    [rules.assistant.runePower]: "PRIVATE",
    inGame: true,
};
describe("power runes, in game", () => {
    describe("time 4:00", () => {
        test("do not play rune sound", () => {
            const results = getResults(rule, {
                ...params,
                time: 4 * 60,
            });
            expect(results).not.toContainAudioEffect();
        });
    });
    describe("time 6:00", () => {
        test("play rune sound", () => {
            const results = getResults(rule, {
                ...params,
                time: 6 * 60,
            });
            expect(results).toContainAudioEffect(
                "resources/audio/rune-power.mp3"
            );
        });
    });
    describe("time 60:00", () => {
        test("play rune sound", () => {
            const results = getResults(rule, {
                ...params,
                time: 60 * 60,
            });
            expect(results).toContainAudioEffect(
                "resources/audio/rune-power.mp3"
            );
        });
    });
});
