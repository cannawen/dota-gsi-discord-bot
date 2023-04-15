import { getResults } from "../../__tests__/helpers";
import GsiData from "../GsiData";
import { IProvider } from "node-gsi";
import rule from "../gsiProvider";

describe("gsi provider parsing", () => {
    test("timestamp", () => {
        const results = getResults(rule, {
            allData: new GsiData({
                provider: {
                    timestamp: 10,
                } as IProvider,
            }),
        });
        expect(results).toContainFact("timestamp", 10);
    });
});
