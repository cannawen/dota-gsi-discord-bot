import rule from "../runeBounty";
import rules from "../../rules";

const params = {
    [rules.assistant.runeBounty]: "PRIVATE",
    inGame: true,
};

describe("bounty runes, in game", () => {
    describe("time 3:00", () => {
        test("play rune sound", () => {
            const results = getResults(rule, {
                ...params,
                time: 3 * 60,
            });
            expect(results).toContainAudioEffect(
                "resources/audio/rune-bounty.wav"
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
                "resources/audio/rune-bounty.wav"
            );
        });
    });
});
