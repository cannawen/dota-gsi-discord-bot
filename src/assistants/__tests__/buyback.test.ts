import rule from "../buyback";
import rules from "../../rules";

// TODO do not expose hasBuybackTopic
const params = {
    [rules.assistant.buyback]: "PRIVATE",
    buybackCooldown: 0,
    gold: 100,
    buybackCost: 100,
    hasBuybackTopic: false,
    time: 30 * 60 + 1,
    inGame: true,
};

describe("buyback gold reminder", () => {
    describe("availablity", () => {
        describe("not in game", () => {
            test("reset buyback state", () => {
                const results = getResults(rule, { inGame: false });
                expect(results).not.toContainTopic("playPrivateAudio");
            });
        });

        describe("in game, before 30 minutes", () => {
            test("no actions", () => {
                const results = getResults(rule, {
                    ...params,
                    time: 10 * 60,
                });
                expect(results).not.toContainTopic("playPrivateAudio");
            });
        });

        describe("in game, after 30 minutes", () => {
            describe("buyback is on cooldown", () => {
                test("should return has no buyback", () => {
                    const results = getResults(rule, {
                        ...params,
                        gold: 0,
                        buybackCost: 0,
                        buybackCooldown: 1,
                    });
                    expect(results).toContainFact("hasBuybackTopic", false);
                });
            });
            describe("not enough gold for buyback", () => {
                test("should return has no buyback", () => {
                    const results = getResults(rule, {
                        ...params,
                        gold: 0,
                        buybackCost: 1,
                        buybackCooldown: 0,
                    });
                    expect(results).toContainFact("hasBuybackTopic", false);
                });
            });
            describe("enough gold for buyback & buyback not on cooldown", () => {
                test("should return has buyback", () => {
                    const results = getResults(rule, {
                        ...params,
                        gold: 1,
                        buybackCost: 1,
                        buybackCooldown: 0,
                    });
                    expect(results).toContainFact("hasBuybackTopic", true);
                });
            });
        });
    });

    describe("warn", () => {
        describe("hasBuybackTopic changed to false", () => {
            describe("buyback not on cooldown", () => {
                test("play effect", () => {
                    const results = getResults(rule, {
                        ...params,
                        buybackCooldown: 0,
                        hasBuybackTopic: false,
                    });
                    expect(results).toContainFact(
                        "playPrivateAudio",
                        "you do not have buyback gold"
                    );
                });
            });
            describe("buyback on cooldown", () => {
                test("do nothing", () => {
                    const results = getResults(rule, {
                        ...params,
                        buybackCooldown: 1,
                        hasBuybackTopic: false,
                    });
                    expect(results).not.toContainTopic("playPrivateAudio");
                });
            });
        });
        describe("hasBuybackTopic changed to true", () => {
            test("do nothing", () => {
                const results = getResults(rule, {
                    ...params,
                    hasBuybackTopic: true,
                });
                expect(results).not.toContainTopic("playPrivateAudio");
            });
        });
    });
});
