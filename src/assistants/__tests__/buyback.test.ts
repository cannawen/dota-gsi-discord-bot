import rule from "../buyback";
import rules from "../../rules";

const params = {
    [rules.assistant.buyback]: "PRIVATE",
    inGame: true,
    buybackCooldown: 0,
    buybackCost: 100,
    time: 30 * 60 + 1,
    gold: 100,
};

describe("buyback gold reminder in a game after 30 minutes", () => {
    describe("buyback available", () => {
        describe("has no buyback gold", () => {
            test("warn if we have not warned before", () => {
                const warningResult = getResults(rule, { ...params, gold: 99 });
                expect(warningResult).toContainAudioEffect(
                    "you do not have buyback gold"
                );
                const alreadyWarned = getResults(
                    rule,
                    { ...params, gold: 98 },
                    warningResult
                );
                expect(alreadyWarned).not.toContainAudioEffect();
            });
        });
        describe("has buyback gold", () => {
            test("do not warn", () => {
                const warningResult = getResults(rule, {
                    ...params,
                    gold: 101,
                });
                expect(warningResult).not.toContainAudioEffect();
            });
        });
    });
    describe("buyback not available", () => {
        test("do not warn", () => {
            const warningResult = getResults(rule, {
                ...params,
                gold: 99,
                buybackCooldown: 1,
            });
            expect(warningResult).not.toContainAudioEffect();
        });
    });
});
