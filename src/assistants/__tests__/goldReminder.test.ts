import { getResults } from "../../__tests__/helpers";
import rule from "../goldReminder";
import rules from "../../rules";

describe("gold reminder", () => {
    describe("not in game", () => {
        test("should not remind player to spend gold", () => {
            const results = getResults(rule, {
                [rules.assistant.goldReminder]: "PRIVATE",
                inGame: false,
                gold: 500,
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
                        });
                        expect(results).toContainFact(
                            "playPrivateAudioFile",
                            "resources/audio/money.mp3"
                        );
                    });
                });
                describe("has reminded before at the same level", () => {
                    test("should not remind player to spend gold", () => {
                        const state = getResults(rule, {
                            [rules.assistant.goldReminder]: "PRIVATE",
                            time: 9 * 60,
                            inGame: true,
                            gold: 500,
                        }) as any;
                        const results = getResults(
                            rule,
                            {
                                [rules.assistant.goldReminder]: "PRIVATE",
                                time: 9 * 60,
                                inGame: true,
                                gold: 500,
                            },
                            state
                        );
                        expect(results).toBeUndefined();
                    });
                    describe("has more than 1000 gold", () => {
                        test("should remind player to spend gold & store 1000 level reminder", () => {
                            const state = getResults(rule, {
                                [rules.assistant.goldReminder]: "PRIVATE",
                                time: 9 * 60,
                                inGame: true,
                                gold: 500,
                            }) as any;
                            const results = getResults(
                                rule,
                                {
                                    [rules.assistant.goldReminder]: "PRIVATE",
                                    time: 9 * 60,
                                    inGame: true,
                                    gold: 1000,
                                },
                                state
                            );
                            expect(results).toContainFact(
                                "playPrivateAudioFile",
                                "resources/audio/money.mp3"
                            );
                        });
                    });
                });
            });
        });

        describe("10-30 minutes", () => {
            describe("reminded at 2000 gold pre-10 minutes", () => {
                test("should not remind at 2000 gold post-10 minutes", () => {
                    const state = getResults(rule, {
                        [rules.assistant.goldReminder]: "PRIVATE",
                        time: 9 * 60,
                        inGame: true,
                        gold: 2000,
                    }) as any;
                    const results = getResults(
                        rule,
                        {
                            [rules.assistant.goldReminder]: "PRIVATE",
                            time: 11 * 60,
                            inGame: true,
                            gold: 2000,
                        },
                        state
                    );
                    expect(results).toBeUndefined();
                });
            });
            describe("should remind on 1000 increments", () => {
                test("less than 1000 gold, do not remind", () => {
                    const results = getResults(rule, {
                        [rules.assistant.goldReminder]: "PRIVATE",
                        time: 11 * 60,
                        inGame: true,
                        gold: 500,
                    });
                    expect(results).toBeUndefined();
                });
                test("more than 1000 gold, remind", () => {
                    const results = getResults(rule, {
                        [rules.assistant.goldReminder]: "PRIVATE",
                        time: 11 * 60,
                        inGame: true,
                        gold: 1000,
                    });
                    expect(results).toContainFact(
                        "playPrivateAudioFile",
                        "resources/audio/money.mp3"
                    );
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
                            buybackCooldown: 0,
                            buybackCost: 2500,
                        });
                        expect(results).toBeUndefined();
                    });
                    test("more than 1000 gold, remind", () => {
                        const results = getResults(rule, {
                            [rules.assistant.goldReminder]: "PRIVATE",
                            time: 31 * 60,
                            inGame: true,
                            gold: 3500,
                            buybackCooldown: 0,
                            buybackCost: 2500,
                        });
                        expect(results).toContainFact(
                            "playPrivateAudioFile",
                            "resources/audio/money.mp3"
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
                            buybackCooldown: 10,
                            buybackCost: 2500,
                        });
                        expect(results).toBeUndefined();
                    });
                    test("more than 1000 gold, remind", () => {
                        const results = getResults(rule, {
                            [rules.assistant.goldReminder]: "PRIVATE",
                            time: 31 * 60,
                            inGame: true,
                            gold: 1000,
                            buybackCooldown: 10,
                            buybackCost: 2500,
                        });
                        expect(results).toContainFact(
                            "playPrivateAudioFile",
                            "resources/audio/money.mp3"
                        );
                    });
                });
            });
        });

        describe("player spends gold", () => {
            test("should not remind", () => {
                const state = getResults(rule, {
                    [rules.assistant.goldReminder]: "PRIVATE",
                    time: 9 * 60,
                    inGame: true,
                    gold: 2000,
                }) as any;
                const results = getResults(
                    rule,
                    {
                        [rules.assistant.goldReminder]: "PRIVATE",
                        time: 9 * 60,
                        inGame: true,
                        gold: 500,
                    },
                    state
                );
                expect(results).not.toContainFact(
                    "playPrivateAudioFile",
                    "resources/audio/money.mp3"
                );
            });
        });

        describe("reminder intensity", () => {
            describe("1000 gold over", () => {
                test("mild intensity", () => {
                    const results = getResults(rule, {
                        [rules.assistant.goldReminder]: "PRIVATE",
                        time: 9 * 60,
                        inGame: true,
                        gold: 1000,
                    });
                    expect(results).toContainFact(
                        "playPrivateAudioFile",
                        "resources/audio/money.mp3"
                    );
                });
            });
            describe("2000 gold over", () => {
                test("medium intensity", () => {
                    const results = getResults(rule, {
                        [rules.assistant.goldReminder]: "PRIVATE",
                        time: 9 * 60,
                        inGame: true,
                        gold: 2000,
                    });
                    expect(results).toContainFact(
                        "playPrivateAudioFile",
                        "resources/audio/lot-of-money.mp3"
                    );
                });
            });
            describe("3000 gold over", () => {
                test("high intensity", () => {
                    const results = getResults(rule, {
                        [rules.assistant.goldReminder]: "PRIVATE",
                        time: 9 * 60,
                        inGame: true,
                        gold: 3000,
                    });
                    expect(results).toContainFact(
                        "playPrivateAudioFile",
                        "resources/audio/really-lot-of-money.mp3"
                    );
                });
            });
        });
    });
});
