import { DeepReadonly } from "ts-essentials";
import Item from "../../gsi-data-classes/Item";
import neutralItemRule from "../neutralItemDigReminder";
import PlayerItems from "../../gsi-data-classes/PlayerItems";
import rules from "../../rules";

// TODO do not expose lastNeutralItemDigReminderTimeTopic in tests

const NO_ITEMS = new PlayerItems(
    [],
    [],
    [],
    null,
    null
) as DeepReadonly<PlayerItems>;

const TRUSTY_SHOVEL = new PlayerItems(
    [],
    [],
    [],
    null,
    new Item("item_trusty_shovel", "Trusty Shovel", 0)
);

const PIRATE_HAT = new PlayerItems(
    [],
    [],
    [],
    null,
    new Item("item_pirate_hat", "Pirate Hat", 0)
);

const SHOVEL_ON_COOLDOWN = new PlayerItems(
    [],
    [],
    [],
    null,
    new Item("item_trusty_shovel", "Trusty Shovel", 1)
);

const SHOVEL_ON_COOLDOWN_IN_BACKPACK = new PlayerItems(
    [],
    [new Item("item_trusty_shovel", "Trusty Shovel", 1)],
    [],
    null,
    null
);

const SHOVEL_READY_IN_BACKPACK = new PlayerItems(
    [],
    [new Item("item_trusty_shovel", "Trusty Shovel", 0)],
    [],
    null,
    null
);

const TWO_NEUTRAL_ITEMS_ONE_READY_A = new PlayerItems(
    [],
    [new Item("item_trusty_shovel", "Trusty Shovel", 0)],
    [],
    null,
    new Item("item_pirate_hat", "Pirate Hat", 1)
);

const TWO_NEUTRAL_ITEMS_ONE_READY_B = new PlayerItems(
    [],
    [new Item("item_trusty_shovel", "Trusty Shovel", 1)],
    [],
    null,
    new Item("item_pirate_hat", "Pirate Hat", 0)
);

const TWO_NEUTRAL_ITEMS_ONE_READY_C = new PlayerItems(
    [],
    [
        new Item("item_trusty_shovel", "Trusty Shovel", 1),
        new Item("item_pirate_hat", "Pirate Hat", 0),
    ],
    [],
    null,
    null
);

describe("neutral item dig reminder", () => {
    describe("player is dead", () => {
        test("invalidate reminder time", () => {
            const result = getResults(neutralItemRule, {
                [rules.assistant.neutralItemDigReminder]: "PRIVATE",
                alive: false,
                inGame: true,
                items: TRUSTY_SHOVEL,
                lastNeutralItemDigReminderTimeTopic: 5,
                time: 50,
            });
            expect(result).not.toContainFact(
                "lastNeutralItemDigReminderTimeTopic"
            );
        });
    });

    describe("player is alive", () => {
        describe("no neutral item", () => {
            test("invalidate reminder time", () => {
                const result = getResults(neutralItemRule, {
                    [rules.assistant.neutralItemDigReminder]: "PRIVATE",
                    alive: true,
                    inGame: true,
                    items: NO_ITEMS,
                    lastNeutralItemDigReminderTimeTopic: 5,
                    time: 50,
                });
                expect(result).toContainFact(
                    "lastNeutralItemDigReminderTimeTopic",
                    undefined
                );
            });
        });

        describe("pirate hat is ready to dig", () => {
            describe("never reminded before", () => {
                test("update reminder time, but do not play tts", () => {
                    const result = getResults(neutralItemRule, {
                        [rules.assistant.neutralItemDigReminder]: "PRIVATE",
                        alive: true,
                        inGame: true,
                        items: PIRATE_HAT,
                        lastNeutralItemDigReminderTimeTopic: undefined,
                        time: 50,
                    });
                    expect(result).toContainFact(
                        "lastNeutralItemDigReminderTimeTopic",
                        50
                    );
                    expect(result).not.toContainTopic("playPrivateAudio");
                });
            });
        });

        describe("shovel is ready to dig", () => {
            describe("never reminded before", () => {
                test("update reminder time, but do not play tts", () => {
                    const result = getResults(neutralItemRule, {
                        [rules.assistant.neutralItemDigReminder]: "PRIVATE",
                        alive: true,
                        inGame: true,
                        items: TRUSTY_SHOVEL,
                        lastNeutralItemDigReminderTimeTopic: undefined,
                        time: 50,
                    });
                    expect(result).toContainFact(
                        "lastNeutralItemDigReminderTimeTopic",
                        50
                    );
                    expect(result).not.toContainTopic("playPrivateAudio");
                });
            });
            describe("reminded 1 second ago", () => {
                test("do not change any state", () => {
                    const result = getResults(neutralItemRule, {
                        [rules.assistant.neutralItemDigReminder]: "PRIVATE",
                        alive: true,
                        inGame: true,
                        items: TRUSTY_SHOVEL,
                        lastNeutralItemDigReminderTimeTopic: 49,
                        time: 50,
                    });
                    expect(result).not.toContainTopic("playPrivateAudio");
                });
            });

            describe("reminded 15 seonds ago", () => {
                test("play tts and update reminder time", () => {
                    const result = getResults(neutralItemRule, {
                        [rules.assistant.neutralItemDigReminder]: "PRIVATE",
                        alive: true,
                        inGame: true,
                        items: TRUSTY_SHOVEL,
                        lastNeutralItemDigReminderTimeTopic: 35,
                        time: 50,
                    });
                    expect(result).toContainFact(
                        "lastNeutralItemDigReminderTimeTopic",
                        50
                    );
                    expect(result).toContainFact("playPrivateAudio", "dig");
                });
            });
        });

        describe("shovel is not ready", () => {
            test("invalidate reminder time", () => {
                const result = getResults(neutralItemRule, {
                    [rules.assistant.neutralItemDigReminder]: "PRIVATE",
                    alive: true,
                    inGame: true,
                    items: SHOVEL_ON_COOLDOWN,
                    lastNeutralItemDigReminderTimeTopic: undefined,
                    time: 50,
                });
                expect(result).toContainFact(
                    "lastNeutralItemDigReminderTimeTopic",
                    undefined
                );
            });
        });

        describe("shovel is not ready in backpack", () => {
            test("invalidate reminder time", () => {
                const result = getResults(neutralItemRule, {
                    [rules.assistant.neutralItemDigReminder]: "PRIVATE",
                    alive: true,
                    inGame: true,
                    items: SHOVEL_ON_COOLDOWN_IN_BACKPACK,
                    lastNeutralItemDigReminderTimeTopic: undefined,
                    time: 50,
                });
                expect(result).not.toContainFact(
                    "lastNeutralItemDigReminderTimeTopic"
                );
            });
        });

        describe("shovel is ready to dig in backpack", () => {
            test("play tts and update reminder time", () => {
                const result = getResults(neutralItemRule, {
                    [rules.assistant.neutralItemDigReminder]: "PRIVATE",
                    alive: true,
                    inGame: true,
                    items: SHOVEL_READY_IN_BACKPACK,
                    lastNeutralItemDigReminderTimeTopic: 35,
                    time: 50,
                });
                expect(result).toContainFact(
                    "lastNeutralItemDigReminderTimeTopic",
                    50
                );
                expect(result).toContainFact("playPrivateAudio", "dig");
            });
        });

        describe("two neutral items, one of which is ready to cast", () => {
            test("play tts and update reminder time", () => {
                const resultA = getResults(neutralItemRule, {
                    [rules.assistant.neutralItemDigReminder]: "PRIVATE",
                    alive: true,
                    inGame: true,
                    items: TWO_NEUTRAL_ITEMS_ONE_READY_A,
                    lastNeutralItemDigReminderTimeTopic: 35,
                    time: 50,
                });
                expect(resultA).toContainFact(
                    "lastNeutralItemDigReminderTimeTopic",
                    50
                );
                expect(resultA).toContainFact("playPrivateAudio", "dig");

                const resultB = getResults(neutralItemRule, {
                    [rules.assistant.neutralItemDigReminder]: "PRIVATE",
                    alive: true,
                    inGame: true,
                    items: TWO_NEUTRAL_ITEMS_ONE_READY_B,
                    lastNeutralItemDigReminderTimeTopic: 35,
                    time: 50,
                });
                expect(resultB).toContainFact(
                    "lastNeutralItemDigReminderTimeTopic",
                    50
                );
                expect(resultB).toContainFact("playPrivateAudio", "dig");

                const resultC = getResults(neutralItemRule, {
                    [rules.assistant.neutralItemDigReminder]: "PRIVATE",
                    alive: true,
                    inGame: true,
                    items: TWO_NEUTRAL_ITEMS_ONE_READY_C,
                    lastNeutralItemDigReminderTimeTopic: 35,
                    time: 50,
                });
                expect(resultC).toContainFact(
                    "lastNeutralItemDigReminderTimeTopic",
                    50
                );
                expect(resultC).toContainFact("playPrivateAudio", "dig");
            });
        });
    });
});
