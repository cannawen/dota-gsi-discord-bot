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

const getResults = (rule: Rule, db: { [keys: string]: unknown }) =>
    rule.then(getFn(db));

const NO_ITEMS = new PlayerItems(
    [],
    [],
    null,
    null
) as DeepReadonly<PlayerItems>;

const SHOVEL_NEUTRAL_SLOT_NO_COOLDOWN = new PlayerItems(
    [],
    [],
    new Item("item_trusty_shovel", "Trusty Shovel", 0),
    null
);

const PIRATE_HAT_NEUTRAL_SLOT_NO_COOLDOWN = new PlayerItems(
    [],
    [],
    new Item("item_pirate_hat", "Pirate Hat", 0),
    null
);

describe("neutral item", () => {
    test("should return a rule", () => {
        expect(neutralItemRule).toBeInstanceOf(Rule);
    });

    describe("no neutral item", () => {
        test("reset last neutral reminder time", () => {
            const result = getResults(neutralItemRule, {
                alive: true,
                items: NO_ITEMS,
                lastNeutralReminderTimeTopic: 5,
                time: 50,
            });
            expect(result).toContainFact(
                "lastNeutralReminderTimeTopic",
                undefined
            );
        });
    });

    describe("not alive", () => {
        test("reset last neutral reminder time", () => {
            const result = getResults(neutralItemRule, {
                alive: false,
                items: SHOVEL_NEUTRAL_SLOT_NO_COOLDOWN,
                lastNeutralReminderTimeTopic: 5,
                time: 50,
            });
            expect(result).toContainFact(
                "lastNeutralReminderTimeTopic",
                undefined
            );
        });
    });

    describe("alive with a pirate hat that has 0 cooldown", () => {
        describe("never reminded before", () => {
            test("play tts and update reminder time", () => {
                const result = getResults(neutralItemRule, {
                    alive: true,
                    items: PIRATE_HAT_NEUTRAL_SLOT_NO_COOLDOWN,
                    lastNeutralReminderTimeTopic: undefined,
                    time: 50,
                });
                expect(result).toContainFact(
                    "lastNeutralReminderTimeTopic",
                    50
                );
                expect(result).toContainFact("playTts", "dig");
            });
        });
    });

    describe("alive with a shovel that has 0 cooldown", () => {
        describe("never reminded before", () => {
            test("play tts and update reminder time", () => {
                const result = getResults(neutralItemRule, {
                    alive: true,
                    items: SHOVEL_NEUTRAL_SLOT_NO_COOLDOWN,
                    lastNeutralReminderTimeTopic: undefined,
                    time: 50,
                });
                expect(result).toContainFact(
                    "lastNeutralReminderTimeTopic",
                    50
                );
                expect(result).toContainFact("playTts", "dig");
            });
        });
        describe("reminded 1 second ago", () => {
            test("do not play tts and do not update reminder time", () => {
                const result = getResults(neutralItemRule, {
                    alive: true,
                    items: SHOVEL_NEUTRAL_SLOT_NO_COOLDOWN,
                    lastNeutralReminderTimeTopic: 49,
                    time: 50,
                });
                expect(result).toBeUndefined();
            });
        });

        describe("reminded 15 seonds ago", () => {
            test("play tts and update reminder time", () => {
                const result = getResults(neutralItemRule, {
                    alive: true,
                    items: SHOVEL_NEUTRAL_SLOT_NO_COOLDOWN,
                    lastNeutralReminderTimeTopic: 35,
                    time: 50,
                });
                expect(result).toContainFact(
                    "lastNeutralReminderTimeTopic",
                    50
                );
                expect(result).toContainFact("playTts", "dig");
            });
        });
    });
});
