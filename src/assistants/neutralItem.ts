import { Fact, Topic } from "../Engine";
import engine from "../customEngine";
import topics from "../topics";

const lastNeutralReminderTimeTopic = new Topic<number | undefined>(
    "lastNeutralReminderTimeTopic"
);

engine.register(
    "assistant/neutral_item",
    [topics.items, topics.time, topics.alive],
    (get) => {
        const neutralItem = get(topics.items)?.neutral;
        const time = get(topics.time);

        // If we do not have a time or neutral item, or if we are not alive
        // reset last reminder time
        if (!neutralItem || !time || !get(topics.alive)) {
            return new Fact(lastNeutralReminderTimeTopic, undefined);
        }
        const validNeutralItems = ["item_trusty_shovel", "item_pirate_hat"];
        // If we do not have a valid neutral item, reset last reminder time
        if (!validNeutralItems.find((id) => neutralItem.id === id)) {
            return new Fact(lastNeutralReminderTimeTopic, undefined);
        }
        // If we cannot cast our valid neutral item, reset last reminder time
        if (neutralItem.cooldown === undefined || neutralItem.cooldown > 0) {
            return new Fact(lastNeutralReminderTimeTopic, undefined);
        }

        const lastReminderTime = get(lastNeutralReminderTimeTopic);
        // If we have never reminded the user before
        // or if our last reminder time was more than 15 seconds ago
        if (!lastReminderTime || time > lastReminderTime + 15) {
            // Remind the user
            // And update the last reminder time
            return [
                new Fact(topics.playAudioFile, "shovel.mp3"),
                new Fact(lastNeutralReminderTimeTopic, get(topics.time)),
            ];
        }
    }
);
