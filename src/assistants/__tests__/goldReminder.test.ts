import Fact from "../../engine/Fact";
import rule from "../goldReminder";
import rules from "../../rules";

const params = {
    [rules.assistant.goldReminder]: "PRIVATE",
    inGame: true,
    buybackCost: 0,
    buybackCooldown: 0,
    time: 9 * 60,
    gold: 0,
};

describe("gold reminder", () => {
    describe("not in game", () => {
        test("should not remind player to spend gold", () => {
            const results = getResults(rule, {
                ...params,
                inGame: false,
                gold: 500,
            });
            expect(results).not.toContainAudioEffect();
        });
    });

    describe("in game", () => {
        test("should not remind about 0 gold", () => {
            const results = getResults(rule, {
                ...params,
                gold: 0,
            });
            expect(results).not.toContainAudioEffect();
        });

        describe("before 10 minutes", () => {
            describe("has more than 500 gold", () => {
                let result500Gold: Fact<unknown>[];
                beforeEach(() => {
                    result500Gold = getResults(rule, {
                        ...params,
                        gold: 500,
                    });
                });
                describe("has not reminded before", () => {
                    test("should remind player to spend gold", () => {
                        expect(result500Gold).toContainAudioEffect();
                    });
                });
                describe("has reminded before at the same level", () => {
                    test("should not remind player to spend gold", () => {
                        const results = getResults(
                            rule,
                            {
                                ...params,
                                gold: 500,
                            },
                            removeEphemeralState(result500Gold)
                        );
                        expect(results).not.toContainAudioEffect();
                    });
                    describe("has more than 1000 gold", () => {
                        test("should remind player to spend gold", () => {
                            const results = getResults(
                                rule,
                                {
                                    ...params,
                                    gold: 1000,
                                },
                                removeEphemeralState(result500Gold)
                            );
                            expect(results).toContainAudioEffect();
                        });
                    });
                });
            });
        });

        describe("10-30 minutes", () => {
            describe("reminded at 2000 gold pre-10 minutes", () => {
                test("should not remind at 2000 gold post-10 minutes", () => {
                    const state = getResults(rule, {
                        ...params,
                        gold: 2000,
                    }) as Fact<unknown>[];
                    const results = getResults(
                        rule,
                        {
                            ...params,
                            time: 11 * 60,
                            gold: 2000,
                        },
                        removeEphemeralState(state)
                    );
                    expect(results).not.toContainAudioEffect();
                });
            });
            describe("should remind on 1000 increments", () => {
                test("less than 1000 gold, do not remind", () => {
                    const results = getResults(rule, {
                        ...params,
                        time: 11 * 60,
                        gold: 500,
                    });
                    expect(results).not.toContainAudioEffect();
                });
                test("more than 1000 gold, remind", () => {
                    const results = getResults(rule, {
                        ...params,
                        time: 11 * 60,
                        gold: 1000,
                    });
                    expect(results).toContainAudioEffect();
                });
            });
        });

        describe("30+ minutes", () => {
            describe("has buyback", () => {
                describe("should remind on 1000 increments over buyback gold", () => {
                    test("less than 1000 gold, do not remind", () => {
                        const results = getResults(rule, {
                            ...params,
                            time: 31 * 60,
                            buybackCooldown: 0,
                            buybackCost: 2500,
                            gold: 3000,
                        });
                        expect(results).not.toContainAudioEffect();
                    });
                    test("more than 1000 gold, remind", () => {
                        const results = getResults(rule, {
                            ...params,
                            time: 31 * 60,
                            gold: 3500,
                            buybackCooldown: 0,
                            buybackCost: 2500,
                        });
                        expect(results).toContainAudioEffect();
                    });
                });
            });

            describe("has no buyback", () => {
                describe("should remind on 1000 increments regardless of buyback gold cost", () => {
                    test("less than 1000 gold, do not remind", () => {
                        const results = getResults(rule, {
                            ...params,
                            time: 31 * 60,
                            gold: 500,
                            buybackCooldown: 10,
                            buybackCost: 2500,
                        });
                        expect(results).not.toContainAudioEffect();
                    });
                    test("more than 1000 gold, remind", () => {
                        const results = getResults(rule, {
                            ...params,
                            time: 31 * 60,
                            gold: 1000,
                            buybackCooldown: 10,
                            buybackCost: 2500,
                        });
                        expect(results).toContainAudioEffect();
                    });
                });
            });
        });

        describe("player spends gold", () => {
            test("should not remind", () => {
                const state = getResults(rule, {
                    ...params,
                    time: 9 * 60,
                    gold: 2000,
                }) as Fact<unknown>[];
                const results = getResults(
                    rule,
                    {
                        [rules.assistant.goldReminder]: "PRIVATE",
                        time: 9 * 60,
                        inGame: true,
                        gold: 500,
                    },
                    removeEphemeralState(state)
                );
                expect(results).not.toContainAudioEffect();
            });
        });

        describe("reminder intensity", () => {
            describe("1500 gold over", () => {
                test("mild intensity", () => {
                    const results = getResults(rule, {
                        ...params,
                        gold: 1500,
                    });
                    expect(results).toContainAudioEffect(
                        "resources/audio/gold.mp3"
                    );
                });
            });
            describe("2500 gold over", () => {
                test("medium intensity", () => {
                    const results = getResults(rule, {
                        ...params,
                        gold: 2500,
                    });
                    expect(results).toContainAudioEffect(
                        "you have a lot of gold"
                    );
                });
            });
            describe("2500+ gold over", () => {
                test("high intensity", () => {
                    const results = getResults(rule, {
                        ...params,
                        gold: 2501,
                    });
                    expect(results).toContainAudioEffect(
                        "you really have a lot of gold"
                    );
                });
            });
        });
    });
});
