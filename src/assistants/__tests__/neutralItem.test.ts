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

const TRUSTY_SHOVEL = new PlayerItems(
    [],
    [],
    new Item("item_trusty_shovel", "Trusty Shovel", 0),
    null
);

const PIRATE_HAT = new PlayerItems(
    [],
    [],
    new Item("item_pirate_hat", "Pirate Hat", 0),
    null
);

const SHOVEL_ON_COOLDOWN = new PlayerItems(
    [],
    [],
    new Item("item_trusty_shovel", "Trusty Shovel", 1),
    null
);

const SHOVEL_ON_COOLDOWN_IN_STASH = new PlayerItems(
    [],
    [new Item("item_trusty_shovel", "Trusty Shovel", 1)],
    null,
    null
);

const SHOVEL_READY_IN_STASH = new PlayerItems(
    [],
    [new Item("item_trusty_shovel", "Trusty Shovel", 0)],
    null,
    null
);

const TWO_NEUTRAL_ITEMS_ONE_READY_A = new PlayerItems(
    [],
    [new Item("item_trusty_shovel", "Trusty Shovel", 0)],
    new Item("item_pirate_hat", "Pirate Hat", 1),
    null
);

const TWO_NEUTRAL_ITEMS_ONE_READY_B = new PlayerItems(
    [],
    [new Item("item_trusty_shovel", "Trusty Shovel", 1)],
    new Item("item_pirate_hat", "Pirate Hat", 0),
    null
);

const TWO_NEUTRAL_ITEMS_ONE_READY_C = new PlayerItems(
    [],
    [
        new Item("item_trusty_shovel", "Trusty Shovel", 1),
        new Item("item_pirate_hat", "Pirate Hat", 0),
    ],
    null,
    null
);

describe("neutral item", () => {
    describe("player is dead", () => {
        test("invalidate reminder time", () => {
            const result = getResults(neutralItemRule, {
                alive: false,
                items: TRUSTY_SHOVEL,
                lastNeutralReminderTimeTopic: 5,
                time: 50,
            });
            expect(result).toContainFact(
                "lastNeutralReminderTimeTopic",
                undefined
            );
        });
    });

    describe("player is alive", () => {
        describe("no neutral item", () => {
            test("invalidate reminder time", () => {
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

        describe("pirate hat is ready to dig", () => {
            describe("never reminded before", () => {
                test("play tts and update reminder time", () => {
                    const result = getResults(neutralItemRule, {
                        alive: true,
                        items: PIRATE_HAT,
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

        describe("shovel is ready to dig", () => {
            describe("never reminded before", () => {
                test("play tts and update reminder time", () => {
                    const result = getResults(neutralItemRule, {
                        alive: true,
                        items: TRUSTY_SHOVEL,
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
                test("do not change any state", () => {
                    const result = getResults(neutralItemRule, {
                        alive: true,
                        items: TRUSTY_SHOVEL,
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
                        items: TRUSTY_SHOVEL,
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

        describe("shovel is not ready", () => {
            test("invalidate reminder time", () => {
                const result = getResults(neutralItemRule, {
                    alive: true,
                    items: SHOVEL_ON_COOLDOWN,
                    lastNeutralReminderTimeTopic: undefined,
                    time: 50,
                });
                expect(result).toContainFact(
                    "lastNeutralReminderTimeTopic",
                    undefined
                );
            });
        });

        describe("shovel is not ready in stash", () => {
            test("invalidate reminder time", () => {
                const result = getResults(neutralItemRule, {
                    alive: true,
                    items: SHOVEL_ON_COOLDOWN_IN_STASH,
                    lastNeutralReminderTimeTopic: undefined,
                    time: 50,
                });
                expect(result).toContainFact(
                    "lastNeutralReminderTimeTopic",
                    undefined
                );
            });
        });

        describe("shovel is ready to dig in stash", () => {
            test("play tts and update reminder time", () => {
                const result = getResults(neutralItemRule, {
                    alive: true,
                    items: SHOVEL_READY_IN_STASH,
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

        describe("two neutral items, one of which is ready to cast", () => {
            test("play tts and update reminder time", () => {
                const resultA = getResults(neutralItemRule, {
                    alive: true,
                    items: TWO_NEUTRAL_ITEMS_ONE_READY_A,
                    lastNeutralReminderTimeTopic: undefined,
                    time: 50,
                });
                expect(resultA).toContainFact(
                    "lastNeutralReminderTimeTopic",
                    50
                );
                expect(resultA).toContainFact("playTts", "dig");

                const resultB = getResults(neutralItemRule, {
                    alive: true,
                    items: TWO_NEUTRAL_ITEMS_ONE_READY_B,
                    lastNeutralReminderTimeTopic: undefined,
                    time: 50,
                });
                expect(resultB).toContainFact(
                    "lastNeutralReminderTimeTopic",
                    50
                );
                expect(resultB).toContainFact("playTts", "dig");

                const resultC = getResults(neutralItemRule, {
                    alive: true,
                    items: TWO_NEUTRAL_ITEMS_ONE_READY_C,
                    lastNeutralReminderTimeTopic: undefined,
                    time: 50,
                });
                expect(resultC).toContainFact(
                    "lastNeutralReminderTimeTopic",
                    50
                );
                expect(resultC).toContainFact("playTts", "dig");
            });
        });
    });
});
