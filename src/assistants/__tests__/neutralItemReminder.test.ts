import { DeepReadonly } from "ts-essentials";
import Item from "../../gsi-data-classes/Item";
import PlayerItems from "../../gsi-data-classes/PlayerItems";
import rule from "../neutralItemReminder";
import rules from "../../rules";

const NEUTRAL_ITEM_REMINDER_START_MINUTE = 5.5;

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

const params = {
    customGameName: "",
    alive: true,
    inGame: true,
    [rules.assistant.neutralItemReminder]: "PRIVATE",
    items: NO_ITEMS,
    time: NEUTRAL_ITEM_REMINDER_START_MINUTE * 60,
};

describe("neutralItemReminder", () => {
    describe("does not have neutral item", () => {
        test("do not warn before 10:30", () => {
            const result = getResults(rule, {
                ...params,
                time: (NEUTRAL_ITEM_REMINDER_START_MINUTE - 1) * 60,
            });
            expect(result).not.toContainAudioEffect();
        });

        test("warn after 2 minutes grace", () => {
            const state = getResults(rule, params, undefined);
            const result = getResults(
                rule,
                {
                    ...params,
                    time: (NEUTRAL_ITEM_REMINDER_START_MINUTE + 2) * 60,
                },
                state
            );
            expect(result).toContainAudioEffect(
                "neutral.mp3"
            );
            const result2 = getResults(
                rule,
                {
                    ...params,
                    time: (NEUTRAL_ITEM_REMINDER_START_MINUTE + 4) * 60,
                },
                result
            );
            expect(result2).toContainAudioEffect(
                "neutral.mp3"
            );
        });
    });

    describe("gets neutral item within 1 minute", () => {
        test("should not warn", () => {
            const state1 = getResults(rule, {
                ...params,
                time: NEUTRAL_ITEM_REMINDER_START_MINUTE * 60,
            });
            const state2 = getResults(
                rule,
                {
                    ...params,
                    time: (NEUTRAL_ITEM_REMINDER_START_MINUTE + 1) * 60,
                    items: HAS_TIER_2_NEUTRAL_ITEM,
                },
                state1
            );
            const result = getResults(
                rule,
                {
                    ...params,
                    time: 9 * 60,
                    items: HAS_TIER_2_NEUTRAL_ITEM,
                },
                state2
            );
            expect(result).not.toContainAudioEffect();
        });
    });
});
