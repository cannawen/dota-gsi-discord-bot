import { DeepReadonly } from "ts-essentials";
import Item from "../../gsi-data-classes/Item";
import PlayerItems from "../../gsi-data-classes/PlayerItems";
import rule from "../neutralItemReminder";
import rules from "../../rules";

const NEUTRAL_ITEM_REMINDER_START_MINUTE = 10;

const NO_ITEMS = new PlayerItems(
    [],
    [],
    [],
    null,
    null
) as DeepReadonly<PlayerItems>;

const HAS_TIER_2_NEUTRAL_ITEM = new PlayerItems(
    [],
    [],
    [],
    null,
    new Item("item_philosophers_stone", "Philosopher's Stone")
) as DeepReadonly<PlayerItems>;

describe("neutralItemReminder", () => {
    describe("does not have neutral item", () => {
        test("do not warn before 10 minutes", () => {
            const result = getResults(rule, {
                [rules.assistant.neutralItemReminder]: "PRIVATE",
                time: (NEUTRAL_ITEM_REMINDER_START_MINUTE - 1) * 60,
                inGame: true,
                items: NO_ITEMS,
            });
            expect(result).not.toContainAudioEffect();
        });

        test("warn after 2 minutes grace", () => {
            const state = getResults(rule, {
                [rules.assistant.neutralItemReminder]: "PRIVATE",
                time: NEUTRAL_ITEM_REMINDER_START_MINUTE * 60,
                inGame: true,
                items: NO_ITEMS,
            });
            const result = getResults(
                rule,
                {
                    [rules.assistant.neutralItemReminder]: "PRIVATE",
                    time: (NEUTRAL_ITEM_REMINDER_START_MINUTE + 2) * 60,
                    inGame: true,
                    items: NO_ITEMS,
                },
                state
            );
            expect(result).toContainAudioEffect(
                "you do not have a neutral item"
            );
            const result2 = getResults(
                rule,
                {
                    [rules.assistant.neutralItemReminder]: "PRIVATE",
                    time: (NEUTRAL_ITEM_REMINDER_START_MINUTE + 4) * 60,
                    inGame: true,
                    items: NO_ITEMS,
                },
                result
            );
            expect(result2).toContainAudioEffect(
                "you do not have a neutral item"
            );
        });
    });

    describe("gets neutral item within 1 minute", () => {
        test("should not warn", () => {
            const state1 = getResults(rule, {
                [rules.assistant.neutralItemReminder]: "PRIVATE",
                time: NEUTRAL_ITEM_REMINDER_START_MINUTE * 60,
                inGame: true,
                items: NO_ITEMS,
            });
            const state2 = getResults(
                rule,
                {
                    [rules.assistant.neutralItemReminder]: "PRIVATE",
                    time: (NEUTRAL_ITEM_REMINDER_START_MINUTE + 1) * 60,
                    inGame: true,
                    items: HAS_TIER_2_NEUTRAL_ITEM,
                },
                state1
            );
            const result = getResults(
                rule,
                {
                    [rules.assistant.neutralItemReminder]: "PRIVATE",
                    time: 9 * 60,
                    inGame: true,
                    items: HAS_TIER_2_NEUTRAL_ITEM,
                },
                state2
            );
            expect(result).not.toContainAudioEffect();
        });
    });

    describe("has a neutral item", () => {
        describe("is the same tier", () => {
            test("do not remind", () => {
                const state1 = getResults(rule, {
                    [rules.assistant.neutralItemReminder]: "PRIVATE",
                    time: 18 * 60, // Tier 2 zone
                    inGame: true,
                    items: HAS_TIER_2_NEUTRAL_ITEM,
                });
                const state2 = getResults(
                    rule,
                    {
                        [rules.assistant.neutralItemReminder]: "PRIVATE",
                        time: 20 * 60, // Tier 2 zone
                        inGame: true,
                        items: HAS_TIER_2_NEUTRAL_ITEM,
                    },
                    state1
                );
                expect(state2).not.toContainAudioEffect();
            });
        });
        describe("is one tier below", () => {
            test("do not remind", () => {
                const state1 = getResults(rule, {
                    [rules.assistant.neutralItemReminder]: "PRIVATE",
                    time: 28 * 60, // Tier 3 zone
                    inGame: true,
                    items: HAS_TIER_2_NEUTRAL_ITEM,
                });
                const state2 = getResults(
                    rule,
                    {
                        [rules.assistant.neutralItemReminder]: "PRIVATE",
                        time: 30 * 60, // Tier 3 zone
                        inGame: true,
                        items: HAS_TIER_2_NEUTRAL_ITEM,
                    },
                    state1
                );
                expect(state2).not.toContainAudioEffect();
            });
        });
        describe("is 2 tiers below", () => {
            test("remind to get a better neutral", () => {
                const state1 = getResults(rule, {
                    [rules.assistant.neutralItemReminder]: "PRIVATE",
                    time: 38 * 60, // Tier 4 zone
                    inGame: true,
                    items: HAS_TIER_2_NEUTRAL_ITEM,
                });
                const state2 = getResults(
                    rule,
                    {
                        [rules.assistant.neutralItemReminder]: "PRIVATE",
                        time: 40 * 60, // Tier 4 zone
                        inGame: true,
                        items: HAS_TIER_2_NEUTRAL_ITEM,
                    },
                    state1
                );
                expect(state2).toContainAudioEffect(
                    "you should upgrade your neutral item"
                );
            });
        });
        describe("is 3 tiers below", () => {
            test("remind to get a better neutral", () => {
                const state1 = getResults(rule, {
                    [rules.assistant.neutralItemReminder]: "PRIVATE",
                    time: 60 * 60, // Tier 5 zone
                    inGame: true,
                    items: HAS_TIER_2_NEUTRAL_ITEM,
                });
                const state2 = getResults(
                    rule,
                    {
                        [rules.assistant.neutralItemReminder]: "PRIVATE",
                        time: 62 * 60, // Tier 5 zone
                        inGame: true,
                        items: HAS_TIER_2_NEUTRAL_ITEM,
                    },
                    state1
                );
                expect(state2).toContainAudioEffect(
                    "you should upgrade your neutral item"
                );
            });
        });
    });
});
