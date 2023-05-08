import rule from "../lotus";
import rules from "../../rules";

const params = {
    [rules.assistant.lotus]: "PUBLIC",
    inGame: true,
    time: 3 * 60 - 15,
};
describe("healing lotus, in game", () => {
    let initial: any;
    beforeEach(() => {
        initial = getResults(rule, params);
    });
    describe("3 minute", () => {
        test("play sound", () => {
            expect(initial).toContainAudioEffect(
                "resources/audio/lotus-soon.mp3"
            );
        });
    });
    describe("11 minute", () => {
        test("do not play sound", () => {
            const results = getResults(
                rule,
                {
                    ...params,
                    time: 11 * 60 - 15,
                },
                initial
            );
            expect(results).not.toContainAudioEffect();
        });
    });

    describe("6 minute", () => {
        test("play sound", () => {
            const results = getResults(
                rule,
                {
                    ...params,
                    time: 6 * 60 - 15,
                },
                initial
            );
            expect(results).toContainAudioEffect();
        });
    });
    describe("15 minute", () => {
        test("do not play sound", () => {
            const results = getResults(
                rule,
                {
                    ...params,
                    time: 15 * 60 - 15,
                },
                initial
            );
            expect(results).not.toContainAudioEffect();
        });
    });
});
