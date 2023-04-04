import { getResults } from "../../__tests__/helpers";
import rule from "../goldReminder";
import rules from "../../rules";

// TODO do not expose lastGoldMultiplierTopic through tests
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
        test("should not remind about 0 gold", () => {
            const results = getResults(rule, {
                [rules.assistant.goldReminder]: "PRIVATE",
                time: 9 * 60,
                inGame: true,
                gold: 0,
                lastGoldMultiplierTopic: undefined,
            });
            expect(results).toBeUndefined();
        });

        describe("before 10 minutes", () => {
            describe("has more than 500 gold", () => {
                describe("has not reminded before", () => {
                    test("should remind player to spend gold & store 500 level reminder", () => {
                        const results = getResults(rule, {
                            [rules.assistant.goldReminder]: "PRIVATE",
                            time: 9 * 60,
                            inGame: true,
                            gold: 500,
                            lastGoldMultiplierTopic: undefined,
                        });
                        expect(results).toContainFact(
                            "playPrivateAudioFile",
                            "resources/audio/money.mp3"
                        );
                        expect(results).toContainFact(
                            "lastGoldMultiplierTopic",
                            1
                        );
                    });
                });
                describe("has reminded before at the same level", () => {
                    test("should not remind player to spend gold", () => {
                        const results = getResults(rule, {
                            [rules.assistant.goldReminder]: "PRIVATE",
                            time: 9 * 60,
                            inGame: true,
                            gold: 500,
                            lastGoldMultiplierTopic: 1,
                        });
                        expect(results).toBeUndefined();
                    });
                    describe("has more than 1000 gold", () => {
                        test("should remind player to spend gold & store 1000 level reminder", () => {
                            const results = getResults(rule, {
                                [rules.assistant.goldReminder]: "PRIVATE",
                                time: 9 * 60,
                                inGame: true,
                                gold: 1000,
                                lastGoldMultiplierTopic: 1,
                            });
                            expect(results).toContainFact(
                                "playPrivateAudioFile",
                                "resources/audio/money.mp3"
                            );
                            expect(results).toContainFact(
                                "lastGoldMultiplierTopic",
                                2
                            );
                        });
                    });
                });
            });
        });

        describe("at 10 minutes", () => {
            test("should scale multiplier", () => {
                const results = getResults(rule, {
                    [rules.assistant.goldReminder]: "PRIVATE",
                    time: 10 * 60,
                    inGame: true,
                    gold: 1000,
                    lastGoldMultiplierTopic: 2,
                });
                expect(results).toContainFact("lastGoldMultiplierTopic", 1);
            });
        });

        describe("10-30 minutes", () => {
            describe("should remind on 1000 increments", () => {
                test("less than 1000 gold, do not remind", () => {
                    const results = getResults(rule, {
                        [rules.assistant.goldReminder]: "PRIVATE",
                        time: 11 * 60,
                        inGame: true,
                        gold: 500,
                        lastGoldMultiplierTopic: 0,
                    });
                    expect(results).toBeUndefined;
                });
                test("more than 1000 gold, remind", () => {
                    const results = getResults(rule, {
                        [rules.assistant.goldReminder]: "PRIVATE",
                        time: 11 * 60,
                        inGame: true,
                        gold: 1000,
                        lastGoldMultiplierTopic: 0,
                    });
                    expect(results).toContainFact(
                        "playPrivateAudioFile",
                        "resources/audio/money.mp3"
                    );
                    expect(results).toContainFact("lastGoldMultiplierTopic", 1);
                });
            });
        });

        describe("30+ minutes", () => {
            describe("has buyback", () => {
                describe("should remind on 1000 increments over buyback gold", () => {
                    test("less than 1000 gold, do not remind", () => {
                        const results = getResults(rule, {
                            [rules.assistant.goldReminder]: "PRIVATE",
                            time: 31 * 60,
                            inGame: true,
                            gold: 3000,
                            lastGoldMultiplierTopic: 0,
                            buybackCooldown: 0,
                            buybackCost: 2500,
                        });
                        expect(results).toBeUndefined;
                    });
                    test("more than 1000 gold, remind", () => {
                        const results = getResults(rule, {
                            [rules.assistant.goldReminder]: "PRIVATE",
                            time: 31 * 60,
                            inGame: true,
                            gold: 3500,
                            lastGoldMultiplierTopic: 0,
                            buybackCooldown: 0,
                            buybackCost: 2500,
                        });
                        expect(results).toContainFact(
                            "playPrivateAudioFile",
                            "resources/audio/money.mp3"
                        );
                        expect(results).toContainFact(
                            "lastGoldMultiplierTopic",
                            1
                        );
                    });
                });
            });

            describe("has no buyback", () => {
                describe("should remind on 1000 increments regardless of buyback gold cost", () => {
                    test("less than 1000 gold, do not remind", () => {
                        const results = getResults(rule, {
                            [rules.assistant.goldReminder]: "PRIVATE",
                            time: 31 * 60,
                            inGame: true,
                            gold: 500,
                            lastGoldMultiplierTopic: 0,
                            buybackCooldown: 10,
                            buybackCost: 2500,
                        });
                        expect(results).toBeUndefined;
                    });
                    test("more than 1000 gold, remind", () => {
                        const results = getResults(rule, {
                            [rules.assistant.goldReminder]: "PRIVATE",
                            time: 31 * 60,
                            inGame: true,
                            gold: 1000,
                            lastGoldMultiplierTopic: 0,
                            buybackCooldown: 10,
                            buybackCost: 2500,
                        });
                        expect(results).toContainFact(
                            "playPrivateAudioFile",
                            "resources/audio/money.mp3"
                        );
                        expect(results).toContainFact(
                            "lastGoldMultiplierTopic",
                            1
                        );
                    });
                });
            });
        });

        describe("player spends gold", () => {
            test("should reset reminder", () => {
                const results = getResults(rule, {
                    [rules.assistant.goldReminder]: "PRIVATE",
                    time: 9 * 60,
                    inGame: true,
                    gold: 500,
                    lastGoldMultiplierTopic: 2,
                });
                expect(results).toContainFact("lastGoldMultiplierTopic", 1);
            });
        });
    });
});
