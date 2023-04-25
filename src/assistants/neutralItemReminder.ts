import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
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
                const appropriateItem = helper.neutral.isItemAppropriateForTime(
                    items.neutral,
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
