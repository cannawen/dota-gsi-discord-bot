import GsiData from "../GsiData";
import { IHero } from "node-gsi";
import rule from "../gsiHero";

describe("gsi hero parsing", () => {
    test("alive", () => {
        const results = getResults(rule, {
            allData: new GsiData({
                hero: {
                    alive: true,
                } as IHero,
            }),
        });
        expect(results).toContainFact("alive", true);
    });
    test("buyback cost", () => {
        const results = getResults(rule, {
            allData: new GsiData({
                hero: {
                    buybackCost: 10,
                } as IHero,
            }),
        });
        expect(results).toContainFact("buybackCost", 10);
    });
    test("buyback cooldown", () => {
        const results = getResults(rule, {
            allData: new GsiData({
                hero: {
                    buybackCooldown: 40,
                } as IHero,
            }),
        });
        expect(results).toContainFact("buybackCooldown", 40);
    });
});
