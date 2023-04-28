import { Dota2GameState, IMap } from "node-gsi";
import GsiData from "../GsiData";
import rule from "../gsiMap";

describe("gsi map parsing", () => {
    describe("time", () => {
        let time10: any;
        beforeEach(() => {
            time10 = getResults(rule, {
                allData: new GsiData({
                    map: {
                        clockTime: 10,
                    } as IMap,
                }),
            });
        });
        test("given previous time is undefined, parses time", () => {
            expect(time10).toContainFact("time", 10);
        });
        // TODO now that we are passing getResults through the real engine,
        // We no longer get the "work in progress" states so we need to test this differently
        // test("given previous time is 10, parses time 12 without skipping 11", () => {
        //     const time12 = getResults(
        //         rule,
        //         {
        //             allData: new GsiData({
        //                 map: {
        //                     clockTime: 12,
        //                 } as IMap,
        //             }),
        //         },
        //         time10
        //     );
        //     expect(time12).toContainFact("time", 11);
        //     expect(time12).toContainFact("time", 12);
        // });
        // test("given previous time is 10, parses time 15 without skipping any time", () => {
        //     const time15 = getResults(
        //         rule,
        //         {
        //             allData: new GsiData({
        //                 map: {
        //                     clockTime: 15,
        //                 } as IMap,
        //             }),
        //         },
        //         time10
        //     );
        //     expect(time15).toContainFact("time", 11);
        //     expect(time15).toContainFact("time", 12);
        //     expect(time15).toContainFact("time", 13);
        //     expect(time15).toContainFact("time", 14);
        //     expect(time15).toContainFact("time", 15);
        // });
        test("given previous time is 10, parses time 16 without backfilling", () => {
            const time16 = getResults(
                rule,
                {
                    allData: new GsiData({
                        map: {
                            clockTime: 16,
                        } as IMap,
                    }),
                },
                time10
            );
            expect(time16).not.toContainFact("time", 11);
            expect(time16).not.toContainFact("time", 12);
            expect(time16).not.toContainFact("time", 13);
            expect(time16).not.toContainFact("time", 14);
            expect(time16).not.toContainFact("time", 15);
            expect(time16).toContainFact("time", 16);
        });
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
