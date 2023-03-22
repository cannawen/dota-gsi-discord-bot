import { engine, Fact, Topic } from "../Engine";
import topics from "../topics";

const lastWarnedNeutralTimeTopic = new Topic<number | undefined>(
    "lastWarnedNeutralTime"
);

engine.register(
    "assistant/neutral_item",
    [topics.items, topics.time, lastWarnedNeutralTimeTopic],
    (db) => {
        const neutralItem = db.get(topics.items)?.neutral;
        const time = db.get(topics.time);
        if (!neutralItem || !time) {
            return;
        }
        const validNeutralItems = ["item_trusty_shovel", "item_pirate_hat"];
        if (!validNeutralItems.find((id) => neutralItem.id === id)) {
            return;
        }
        if (!neutralItem.canCast) {
            return;
        }

        const lastWarnedTime = db.get(lastWarnedNeutralTimeTopic) || 0;
        if (time > lastWarnedTime + 15) {
            const currentTime = db.get(topics.time);
            return [
                new Fact(lastWarnedNeutralTimeTopic, currentTime),
                new Fact(topics.playAudioFile, "shovel.mp3"),
            ];
        }
    }
);
