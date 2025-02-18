import rule from "../runeBounty";
import rules from "../../rules";

const params = {
    customGameName: "",
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
        test("4 min", () => {
            const results = getResults(
                rule,
                {
                    ...params,
                    time: 4 * 60,
                },
                initial
            );
            expect(results).toContainAudioEffect("bounty runes.");
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
            expect(results).toContainAudioEffect("bounty runes.");
        });
    });
});
