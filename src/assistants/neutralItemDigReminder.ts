import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
import Item from "../gsi-data-classes/Item";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.neutralItemDigReminder
);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription =
    "Reminds you to use your Trust Shovel or Pirate Hat";

const VALID_NEUTRAL_ARRAY = [
    helper.neutral.item.trustyShovel,
    helper.neutral.item.pirateHat,
];
const TIME_BETWEEN_REMINDERS = 15;

const lastReminderTimeTopic = topicManager.createTopic<number>(
    "lastNeutralItemDigReminderTimeTopic"
);

function validNeutralItem(item: Item | null): boolean {
    if (!item) {
        return false;
    }
    return VALID_NEUTRAL_ARRAY.reduce(
        (memo, validId) => memo || item.id === validId,
        false
    );
}

function canCast(item: Item | null): boolean {
    if (!item) {
        return false;
    }
    return item.cooldown === 0;
}

export default new RuleDecoratorInGame(
    new RuleDecoratorConfigurable(
        configTopic,
        new Rule(
            rules.assistant.neutralItemDigReminder,
            [topics.alive, topics.items, topics.time],
            (get) => {
                const alive = get(topics.alive)!;
                const items = get(topics.items)!;
                const lastReminderTime = get(lastReminderTimeTopic);
                const time = get(topics.time)!;

                const validItems = [...items.backpack, items.neutral]
                    .filter(validNeutralItem)
                    .filter(canCast);
                // If we are dead or cannot cast any valid neutral items
                // reset last reminder time
                if (!alive || validItems.length === 0) {
                    return new Fact(lastReminderTimeTopic, undefined);
                }

                // If we have never reminded the user before,
                // Give them 15 seconds before we start reminding
                if (!lastReminderTime) {
                    return new Fact(lastReminderTimeTopic, time);
                }
                // If our last reminder time was more than 15 seconds ago
                if (time >= lastReminderTime + TIME_BETWEEN_REMINDERS) {
                    // Remind the user
                    // And update the last reminder time
                    return [
                        new Fact(
                            topics.configurableEffect,
                            "resources/audio/dig.mp3"
                        ),
                        new Fact(lastReminderTimeTopic, time),
                    ];
                }
            }
        )
    )
);
