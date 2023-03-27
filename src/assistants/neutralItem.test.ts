import deepEqual from "deep-equal";
import neutralItemRule from "./neutralItem";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import Topic from "../engine/Topic";
import topic from "../topic";

const lastNeutralReminderTimeTopic = new Topic<number>(
    "lastNeutralReminderTimeTopic"
);
describe("neutral item", () => {
    test("should return a rule", () => {
        expect(neutralItemRule).toBeInstanceOf(Rule);
    });

    test("no items, no output", () => {
        const f = <T>(t: Topic<T>) => {
            if (t === topic.alive) return true;
            if (t === topic.items) return new PlayerItems([], [], null, null);
            if (t === topic.time) return 5;
            if (deepEqual(t, lastNeutralReminderTimeTopic)) return 5;
        };

        const facts = neutralItemRule.then(f as any);
        expect(facts).toBeFact("lastNeutralReminderTimeTopic", undefined);
    });
});
