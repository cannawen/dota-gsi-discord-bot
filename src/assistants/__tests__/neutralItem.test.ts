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

const expectEngine = (
    rule: Rule,
    ins: { [keys: string]: unknown },
    outs: { [keys: string]: unknown }
) => {
    const result = rule.then(getFn(ins));
    Object.keys(outs).forEach((k) => {
        expect(result).toContainFact(k, outs[k]);
    });
};

const noItems = new PlayerItems(
    [],
    [],
    null,
    null
) as DeepReadonly<PlayerItems>;

const trustyShovelNeutralSlot = new PlayerItems(
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
            expectEngine(
                neutralItemRule,
                {
                    alive: true,
                    items: noItems,
                    lastNeutralReminderTimeTopic: 5,
                    time: 50,
                },
                { lastNeutralReminderTimeTopic: undefined }
            );
        });
    });

    describe("not alive", () => {
        test("reset last neutral reminder time", () => {
            expectEngine(
                neutralItemRule,
                {
                    alive: false,
                    items: trustyShovelNeutralSlot,
                    time: 50,
                    lastNeutralReminderTimeTopic: 5,
                },
                { lastNeutralReminderTimeTopic: undefined }
            );
        });
    });
});
