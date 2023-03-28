import { DeepReadonly } from "ts-essentials";
import Item from "../../gsi-data-classes/Item";
import neutralItemRule from "../neutralItem";
import PlayerItems from "../../gsi-data-classes/PlayerItems";
import Rule from "../../engine/Rule";
import Topic from "../../engine/Topic";

const getFn =
    (input: { [keys: string]: unknown }) =>
    <T>(t: Topic<T>): T =>
        input[t.label] as T;

const NO_ITEMS = new PlayerItems(
    [],
    [],
    null,
    null
) as DeepReadonly<PlayerItems>;

const SHOVEL_NEUTRAL_SLOT = new PlayerItems(
    [],
    [],
    new Item("item_trusty_shovel", "", 0),
    null
);

describe("neutral item", () => {
    test("should return a rule", () => {
        expect(neutralItemRule).toBeInstanceOf(Rule);
    });

    describe("no neutral item", () => {
        test("reset last neutral reminder time", () => {
            const result = neutralItemRule.then(
                getFn({
                    alive: true,
                    items: NO_ITEMS,
                    lastNeutralReminderTimeTopic: 5,
                    time: 50,
                })
            );
            expect(result).toContainFact(
                "lastNeutralReminderTimeTopic",
                undefined
            );
        });
    });

    describe("not alive", () => {
        test("reset last neutral reminder time", () => {
            const result = neutralItemRule.then(
                getFn({
                    alive: false,
                    items: SHOVEL_NEUTRAL_SLOT,
                    lastNeutralReminderTimeTopic: 5,
                    time: 50,
                })
            );
            expect(result).toContainFact(
                "lastNeutralReminderTimeTopic",
                undefined
            );
        });
    });
});
