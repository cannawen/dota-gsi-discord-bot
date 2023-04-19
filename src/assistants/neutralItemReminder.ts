import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
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

export default new RuleDecoratorInGame(
    new RuleConfigurable(
        rules.assistant.neutralItemDigReminder,
        configTopic,
        [topics.items, topics.time],
        (get, effect) => {
            const items = get(topics.items)!;
            const time = get(topics.time)!;
            const lastReminderTime = get(lastReminderTimeTopic);

            // Start assistant after 10 minutes
            if (time < NEUTRAL_ITEM_REMINDER_START_MINUTE * 60) {
                return;
            }

            // If we have a neutral item
            if (items.neutral) {
                // If we have reminded them before
                if (lastReminderTime) {
                    // Clear reminder time
                    return new Fact(lastReminderTimeTopic, undefined);
                }
            } else {
                // If we do not have a nuetral item
                // If we have never reminded them before
                if (!lastReminderTime) {
                    // Set reminder time without effect to give them some grace
                    return new Fact(lastReminderTimeTopic, time);
                }
                // If we have been silent for the grace time
                // But they still do not have a neutral item
                if (time - lastReminderTime >= TIME_BETWEEN_REMINDERS) {
                    // Remind them and update reminder time
                    return [
                        new Fact(effect, "resources/audio/no-neutral.mp3"),
                        new Fact(lastReminderTimeTopic, time),
                    ];
                }
            }
        }
    )
);
