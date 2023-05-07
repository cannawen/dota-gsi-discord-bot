import betweenSeconds from "../engine/rules/betweenSeconds";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import helper from "./helpers/neutralItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.neutralItemReminder,
    EffectConfig.PRIVATE
);
export const assistantDescription =
    "Reminds you to pick up a neutral item (after 12:00)";

const TIME_BETWEEN_REMINDERS = 120;
const NEUTRAL_ITEM_REMINDER_START_TIME = 10 * 60;

const lastReminderTimeTopic = topicManager.createTopic<number>(
    "lastNeutralItemReminderTimeTopic"
);

export default betweenSeconds(
    NEUTRAL_ITEM_REMINDER_START_TIME,
    undefined,
    configurable(
        configTopic,
        new Rule({
            label: rules.assistant.neutralItemReminder,
            trigger: [topics.items, topics.time],
            given: [lastReminderTimeTopic],
            then: ([items, time], [lastReminderTime]) => {
                const appropriateItem = helper.isItemAppropriateForTime(
                    items.neutral?.id,
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
                            ? "you should upgrade your neutral item"
                            : "you do not have a neutral item";
                        // Remind them and update reminder time
                        return [
                            new Fact(topics.configurableEffect, audio),
                            new Fact(lastReminderTimeTopic, time),
                        ];
                    }
                }
            },
        })
    )
);
