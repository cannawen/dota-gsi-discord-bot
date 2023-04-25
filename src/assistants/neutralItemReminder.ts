import helper, { Tier } from "./assistantHelpers";
import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
import RuleDecoratorStartAndEndMinute from "../engine/RuleDecoratorStartAndEndMinute";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.neutralItemReminder
);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription =
    "Reminds you to pick up a neutral item (after 12:00)";

const TIME_BETWEEN_REMINDERS = 120;
const NEUTRAL_ITEM_REMINDER_START_MINUTE = 10;

const lastReminderTimeTopic = topicManager.createTopic<number>(
    "lastNeutralItemReminderTimeTopic"
);

function isItemAppropriateForTime(name: string | undefined, time: number) {
    // Having no neutral item is never appropriate
    if (name === undefined) {
        return false;
    }
    const itemTier = helper.neutral.nameToTier(name);
    // Having an unclassified neutral item is always appropriate
    // This is probably a data issue on our end
    if (itemTier === Tier.UNKNOWN) {
        return true;
    }
    // Inappropriate item when it is 2 below the current time tier
    const timeTier = helper.neutral.timeToTier(time);
    return itemTier >= timeTier - 1;
}

export default new RuleDecoratorStartAndEndMinute(
    NEUTRAL_ITEM_REMINDER_START_MINUTE,
    undefined,
    new RuleDecoratorConfigurable(
        configTopic,
        new Rule(
            rules.assistant.neutralItemReminder,
            [topics.items, topics.time],
            (get) => {
                const items = get(topics.items)!;
                const time = get(topics.time)!;
                const lastReminderTime = get(lastReminderTimeTopic);
                const appropriateItem = isItemAppropriateForTime(
                    items.neutral?.name,
                    time
                );

                // If we have an appropriate neutral item
                if (appropriateItem) {
                    // Clear reminder time
                    return new Fact(lastReminderTimeTopic, undefined);
                } else {
                    // If we do not have an appropriate nuetral item
                    // If we have never reminded them before
                    if (!lastReminderTime) {
                        // Set reminder time without effect to give them some grace
                        return new Fact(lastReminderTimeTopic, time);
                    }
                    // If we have been silent for the grace time
                    // But they still do not have an appropriate neutral item
                    if (time - lastReminderTime >= TIME_BETWEEN_REMINDERS) {
                        const audio = items.neutral
                            ? "You should upgrade your neutral item"
                            : "resources/audio/no-neutral.mp3";
                        // Remind them and update reminder time
                        return [
                            new Fact(topics.configurableEffect, audio),
                            new Fact(lastReminderTimeTopic, time),
                        ];
                    }
                }
            }
        )
    )
);
