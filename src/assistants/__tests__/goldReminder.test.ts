import { getResults } from "../../__tests__/helpers";
import rule from "../goldReminder";
import rules from "../../rules";

describe("gold reminder", () => {
    describe("not in game", () => {
        test("should not remind player to spend gold", () => {
            const results = getResults(rule, {
                [rules.assistant.goldReminder]: "PRIVATE",
                inGame: false,
                gold: 501,
                lastGoldMultiplierTopic: undefined,
            });
            expect(results).toBeUndefined();
        });
    });

    describe("in game", () => {
        describe("has more than 500 gold", () => {
            describe("has not reminded before", () => {
                test("should remind player to spend gold & store 500 level reminder", () => {
                    const results = getResults(rule, {
                        [rules.assistant.goldReminder]: "PRIVATE",
                        inGame: true,
                        gold: 501,
                        lastGoldMultiplierTopic: undefined,
                    });
                    expect(results).toContainFact(
                        "playPrivateAudioFile",
                        "resources/audio/gold.mp3"
                    );
                    expect(results).toContainFact("lastGoldMultiplierTopic", 1);
                });
            });
            describe("has reminded before at the same level", () => {
                test("should not remind player to spend gold", () => {
                    const results = getResults(rule, {
                        [rules.assistant.goldReminder]: "PRIVATE",
                        inGame: true,
                        gold: 501,
                        lastGoldMultiplierTopic: 1,
                    });
                    expect(results).toBeUndefined();
                });
                describe("has more than 1000 gold", () => {
                    test("should remind player to spend gold & store 1000 level reminder", () => {
                        const results = getResults(rule, {
                            [rules.assistant.goldReminder]: "PRIVATE",
                            inGame: true,
                            gold: 1001,
                            lastGoldMultiplierTopic: 1,
                        });
                        expect(results).toContainFact(
                            "playPrivateAudioFile",
                            "resources/audio/gold.mp3"
                        );
                        expect(results).toContainFact(
                            "lastGoldMultiplierTopic",
                            2
                        );
                    });
                });
            });
        });

        describe("player spends gold", () => {
            test("should reset reminder", () => {
                const results = getResults(rule, {
                    [rules.assistant.goldReminder]: "PRIVATE",
                    inGame: true,
                    gold: 501,
                    lastGoldMultiplierTopic: 5,
                });
                expect(results).toContainFact("lastGoldMultiplierTopic", 1);
            });
        });
    });
});
