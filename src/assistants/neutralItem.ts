import Config from "../configTopics";
import { DeepReadonly } from "ts-essentials";
import Fact from "../engine/Fact";
import Item from "../gsi-data-classes/Item";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import Topic from "../engine/Topic";
import topics from "../topics";

export const configTopic = new Topic<Config>(rules.assistant.neutralItem);
export const defaultConfig = Config.PRIVATE;

const VALID_NEUTRAL_ARRAY = ["item_trusty_shovel", "item_pirate_hat"];
const TIME_BETWEEN_REMINDERS = 15;

const lastNeutralReminderTimeTopic = new Topic<number>(
    "lastNeutralReminderTimeTopic"
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

export default new RuleConfigurable(
    rules.assistant.neutralItem,
    configTopic,
    [topics.gsi.alive, topics.gsi.items, topics.gsi.time],
    (get, effect) => {
        const alive = get(topics.gsi.alive)!;
        const items = get(topics.gsi.items)!;
        const lastReminderTime = get(lastNeutralReminderTimeTopic);
        const time = get(topics.gsi.time)!;

        const validItems = [...items.backpack, items.neutral]
            .filter(validNeutralItem)
            .filter(canCast);
        // If we are dead or cannot cast any valid neutral items
        // reset last reminder time
        if (!alive || validItems.length === 0) {
            return new Fact(lastNeutralReminderTimeTopic, undefined);
        }

        // If we have never reminded the user before,
        // Give them 15 seconds before we start reminding
        if (!lastReminderTime) {
            return new Fact(lastNeutralReminderTimeTopic, time);
        }
        // If our last reminder time was more than 15 seconds ago
        if (time >= lastReminderTime + TIME_BETWEEN_REMINDERS) {
            // Remind the user
            // And update the last reminder time
            return [
                new Fact(effect, "resources/audio/dig.mp3"),
                new Fact(lastNeutralReminderTimeTopic, time),
            ];
        }
    }
);
