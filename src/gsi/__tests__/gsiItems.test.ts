import { IItem, IItemContainer } from "node-gsi";
import { getResults } from "../../__tests__/helpers";
import GsiData from "../GsiData";
import Item from "../../gsi-data-classes/Item";
import PlayerItems from "../../gsi-data-classes/PlayerItems";
import rule from "../gsiItems";

describe("gsi items parsing", () => {
    test("items", () => {
        const results = getResults(rule, {
            allData: new GsiData({
                items: {
                    slot: [
                        { name: "0" } as IItem,
                        { name: "1" } as IItem,
                        { name: "2" } as IItem,
                        { name: "3" } as IItem,
                        { name: "4" } as IItem,
                        { name: "5" } as IItem,
                        { name: "6" } as IItem,
                        { name: "7" } as IItem,
                        { name: "8" } as IItem,
                    ],
                    stash: [
                        { name: "9" } as IItem,
                        { name: "10" } as IItem,
                        { name: "11" } as IItem,
                        { name: "12" } as IItem,
                        { name: "13" } as IItem,
                        { name: "14" } as IItem,
                    ],
                    teleport: { name: "15" } as IItem,
                    neutral: { name: "16" } as IItem,
                } as IItemContainer,
            }),
        });
        expect(results).toContainFact(
            "items",
            new PlayerItems(
                [
                    new Item("0", "0"),
                    new Item("1", "1"),
                    new Item("2", "2"),
                    new Item("3", "3"),
                    new Item("4", "4"),
                    new Item("5", "5"),
                ],
                [new Item("6", "6"), new Item("7", "7"), new Item("8", "8")],
                [
                    new Item("9", "9"),
                    new Item("10", "10"),
                    new Item("11", "11"),
                    new Item("12", "12"),
                    new Item("13", "13"),
                    new Item("14", "14"),
                ],
                new Item("15", "15"),
                new Item("16", "16")
            )
        );
    });
    test("no items", () => {
        const results = getResults(rule, {
            allData: new GsiData({}),
        });
        expect(results).toContainFact("items", undefined);
    });
});
