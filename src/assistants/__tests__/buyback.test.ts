import rule from "../buyback";
import rules from "../../rules";

const availabilityRule = rule.find(
    (r) => r.label === rules.assistant.buyback.availability
)!;
const warnRule = rule.find(
    (r) => r.label === rules.assistant.buyback.warnNoBuyback
)!;

describe("buyback gold reminder", () => {
    describe("availablity", () => {
        describe("not in game", () => {
            test("reset buyback state", () => {
                const results = getResults(availabilityRule, { inGame: false });
                expect(results).toBeUndefined();
            });
        });

        describe("in game, before 30 minutes", () => {
            test("no actions", () => {
                const results = getResults(availabilityRule, {
                    inGame: true,
                    time: 10 * 60,
                });
                expect(results).toBeUndefined();
            });
        });

        describe("in game, after 30 minutes", () => {
            describe("buyback is on cooldown", () => {
                test("should return has no buyback", () => {
                    const results = getResults(availabilityRule, {
                        inGame: true,
                        time: 31 * 60,
                        gold: 0,
                        buybackCost: 0,
                        buybackCooldown: 1,
                    });
                    expect(results).toContainFact("hasBuybackTopic", false);
                });
            });
            describe("not enough gold for buyback", () => {
                test("should return has no buyback", () => {
                    const results = getResults(availabilityRule, {
                        inGame: true,
                        time: 31 * 60,
                        gold: 0,
                        buybackCost: 1,
                        buybackCooldown: 0,
                    });
                    expect(results).toContainFact("hasBuybackTopic", false);
                });
            });
            describe("enough gold for buyback & buyback not on cooldown", () => {
                test("should return has buyback", () => {
                    const results = getResults(availabilityRule, {
                        inGame: true,
                        time: 31 * 60,
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
                    const results = getResults(warnRule, {
                        Buyback: "PRIVATE",
                        buybackCooldown: 0,
                        hasBuybackTopic: false,
                        inGame: true,
                    });
                    expect(results).toContainFact(
                        "playPrivateAudio",
                        "you do not have buyback gold"
                    );
                });
            });
            describe("buyback on cooldown", () => {
                test("do nothing", () => {
                    const results = getResults(warnRule, {
                        Buyback: "PRIVATE",
                        buybackCooldown: 1,
                        hasBuybackTopic: false,
                        inGame: true,
                    });
                    expect(results).toBeUndefined();
                });
            });
        });
        describe("hasBuybackTopic changed to true", () => {
            test("do nothing", () => {
                const results = getResults(warnRule, {
                    Buyback: "PRIVATE",
                    hasBuybackTopic: true,
                    inGame: true,
                });
                expect(results).toBeUndefined();
            });
        });
    });
});
