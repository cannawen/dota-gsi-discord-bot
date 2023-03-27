import Item from "../../gsi-data-classes/Item";
import neutralItemRule from "../neutralItem";
import PlayerItems from "../../gsi-data-classes/PlayerItems";
import Rule from "../../engine/Rule";
import Topic from "../../engine/Topic";

describe("neutral item", () => {
    test("should return a rule", () => {
        expect(neutralItemRule).toBeInstanceOf(Rule);
    });

    describe("no neutral item", () => {
        test("reset last neutral reminder time", () => {
            const f = <T>(t: Topic<T>) => {
                if (t.label === "alive") return true;
                if (t.label === "items")
                    return new PlayerItems([], [], null, null);
                if (t.label === "time") return 50;
                if (t.label === "lastNeutralReminderTimeTopic") return 5;
            };
            expect(neutralItemRule.then(f as any)).toContainFact(
                "lastNeutralReminderTimeTopic",
                undefined
            );
        });
    });

    describe("not alive", () => {
        test("reset last neutral reminder time", () => {
            const f = <T>(t: Topic<T>) => {
                if (t.label === "alive") return false;
                if (t.label === "items")
                    return new PlayerItems(
                        [],
                        [],
                        new Item("item_trusty_shovel", "", 0),
                        null
                    );
                if (t.label === "time") return 50;
                if (t.label === "lastNeutralReminderTimeTopic") return 5;
            };
            expect(neutralItemRule.then(f as any)).toContainFact(
                "lastNeutralReminderTimeTopic",
                undefined
            );
        });
    });
});
