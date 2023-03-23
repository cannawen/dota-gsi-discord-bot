import { Fact, Topic } from "../Engine";
import engine from "../customEngine";
import Item from "../Item";
import PlayerItems from "../PlayerItems";
import topics from "../topics";

const VALID_NEUTRAL_ARRAY = ["item_trusty_shovel", "item_pirate_hat"];
const TIME_BETWEEN_REMINDERS = 15;

const lastNeutralReminderTimeTopic = new Topic<number | undefined>(
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

function handleNeutralItem(
    alive: boolean,
    items: PlayerItems,
    lastReminderTime: number | undefined,
    time: number
): Fact<unknown>[] | Fact<unknown> | void {
    const validItems = [...items.stash, items.neutral]
        .filter(validNeutralItem)
        .filter(canCast);
    // If we are not alive or if we cannot cast any valid neutral items
    // reset last reminder time
    if (!alive || validItems.length === 0) {
        return new Fact(lastNeutralReminderTimeTopic, undefined);
    }

    // If we have never reminded the user before
    // or if our last reminder time was more than 15 seconds ago
    if (!lastReminderTime || time > lastReminderTime + TIME_BETWEEN_REMINDERS) {
        // Remind the user
        // And update the last reminder time
        return [
            new Fact(topics.playTts, "dig"),
            new Fact(lastNeutralReminderTimeTopic, time),
        ];
    }
}

engine.register(
    "assistant/neutral_item",
    [topics.alive, topics.items, topics.time],
    (get) =>
        handleNeutralItem(
            get(topics.alive),
            get(topics.items),
            get(lastNeutralReminderTimeTopic),
            get(topics.time)
        )
);
