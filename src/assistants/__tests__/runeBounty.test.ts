import rule from "../runeBounty";
import rules from "../../rules";

const params = {
    [rules.assistant.runeBounty]: "PRIVATE",
    inGame: true,
    time: 0,
};

describe("bounty runes, in game", () => {
    let initial: any;
    beforeEach(() => {
        initial = getResults(rule, params);
    });

    describe("no rune sounds", () => {
        test("start of game", () => {
            expect(initial).not.toContainAudioEffect();
        });

        test("2 minutes in", () => {
            const results = getResults(
                rule,
                {
                    ...params,
                    time: 2 * 60,
                },
                initial
            );
            expect(results).not.toContainAudioEffect();
        });
    });
    describe("plays rune sound", () => {
        test("3 min", () => {
            const results = getResults(
                rule,
                {
                    ...params,
                    time: 3 * 60,
                },
                initial
            );
            expect(results).toContainAudioEffect(
                "resources/audio/rune-bounty.wav"
            );
        });
        test("60 min", () => {
            const results = getResults(
                rule,
                {
                    ...params,
                    time: 60 * 60,
                },
                initial
            );
            expect(results).toContainAudioEffect(
                "resources/audio/rune-bounty.wav"
            );
        });
    });
});
