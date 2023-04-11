import { getResults } from "../../__tests__/helpers";
import GsiData from "../GsiData";
import { IPlayer } from "node-gsi";
import rule from "../gsiPlayer";

describe("gsi player parsing", () => {
    test("gold", () => {
        const results = getResults(rule, {
            allData: new GsiData({
                player: {
                    gold: 10,
                } as IPlayer,
            }),
        });
        expect(results).toContainFact("gold", 10);
    });
});
