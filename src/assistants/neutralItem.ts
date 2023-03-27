import { DeepReadonly } from "ts-essentials";
import engine from "../customEngine";
import Fact from "../engine/Fact";
import Item from "../gsi-data-classes/Item";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import Topic from "../engine/Topic";
import topic from "../topic";

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

function handleNeutralItem(
    alive: boolean,
    items: DeepReadonly<PlayerItems>,
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
            new Fact(topic.playTts, "dig"),
            new Fact(lastNeutralReminderTimeTopic, time),
        ];
    }
}

engine.register(
    new Rule(
        "assistant/neutral_item",
        [topic.alive, topic.items, topic.time],
        (get) =>
            handleNeutralItem(
                get(topic.alive)!,
                get(topic.items)!,
                get(lastNeutralReminderTimeTopic),
                get(topic.time)!
            )
    )
);
