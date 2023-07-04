import GsiData from "../GsiData";
import { IPlayer } from "node-gsi";
import rule from "../gsiPlayer";

describe("gsi player parsing", () => {
    test("gold and team", () => {
        const results = getResults(rule, {
            allData: new GsiData({
                player: {
                    gold: 10,
                    team: "dire",
                } as IPlayer,
            }),
        });
        expect(results).toContainFact("gold", 10);
        expect(results).toContainFact("team", "dire");
    });
});
