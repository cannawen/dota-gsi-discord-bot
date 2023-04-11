import { Dota2GameState, IMap } from "node-gsi";
import { getResults } from "../../__tests__/helpers";
import GsiData from "../GsiData";
import rule from "../gsiMap";

describe("gsi map parsing", () => {
    test("time", () => {
        const results = getResults(rule, {
            allData: new GsiData({
                map: {
                    clockTime: 10,
                } as IMap,
            }),
        });
        expect(results).toContainFact("time", 10);
    });
    test("paused", () => {
        const results = getResults(rule, {
            allData: new GsiData({
                map: {
                    paused: true,
                } as IMap,
            }),
        });
        expect(results).toContainFact("paused", true);
    });
    describe("in game", () => {
        test("GameInProgress", () => {
            const results = getResults(rule, {
                allData: new GsiData({
                    map: {
                        gameState: Dota2GameState.GameInProgress,
                    } as IMap,
                }),
            });
            expect(results).toContainFact("inGame", true);
        });
    });

    describe("not in game", () => {
        test("Init", () => {
            const results = getResults(rule, {
                allData: new GsiData({
                    map: {
                        gameState: Dota2GameState.Init,
                    } as IMap,
                }),
            });
            expect(results).toContainFact("inGame", false);
        });
        test("HeroSelection", () => {
            const results = getResults(rule, {
                allData: new GsiData({
                    map: {
                        gameState: Dota2GameState.HeroSelection,
                    } as IMap,
                }),
            });
            expect(results).toContainFact("inGame", false);
        });
        test("StrategyTime", () => {
            const results = getResults(rule, {
                allData: new GsiData({
                    map: {
                        gameState: Dota2GameState.StrategyTime,
                    } as IMap,
                }),
            });
            expect(results).toContainFact("inGame", false);
        });
        test("TeamShowcase", () => {
            const results = getResults(rule, {
                allData: new GsiData({
                    map: {
                        gameState: Dota2GameState.TeamShowcase,
                    } as IMap,
                }),
            });
            expect(results).toContainFact("inGame", false);
        });
        test("PreGame", () => {
            const results = getResults(rule, {
                allData: new GsiData({
                    map: {
                        gameState: Dota2GameState.PreGame,
                    } as IMap,
                }),
            });
            expect(results).toContainFact("inGame", false);
        });
        test("PostGame", () => {
            const results = getResults(rule, {
                allData: new GsiData({
                    map: {
                        gameState: Dota2GameState.PostGame,
                    } as IMap,
                }),
            });
            expect(results).toContainFact("inGame", false);
        });
    });
});
