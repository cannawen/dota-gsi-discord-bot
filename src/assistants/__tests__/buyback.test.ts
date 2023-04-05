import { getResults } from "../../__tests__/helpers";
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
            test("no actions", () => {
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
            test("play effect", () => {
                const results = getResults(warnRule, {
                    buyback: "PRIVATE",
                    hasBuybackTopic: false,
                });
                expect(results).toContainFact(
                    "playPrivateAudioFile",
                    "resources/audio/buyback-warning.mp3"
                );
            });
        });
        describe("hasBuybackTopic changed to true", () => {
            test("do nothing", () => {
                const results = getResults(warnRule, {
                    buyback: "PRIVATE",
                    hasBuybackTopic: true,
                });
                expect(results).toBeUndefined();
            });
        });
    });
});
