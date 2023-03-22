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
            return [new Fact(lastWarnedNeutralTimeTopic, undefined)];
        }
        const validNeutralItems = ["item_trusty_shovel", "item_pirate_hat"];
        if (!validNeutralItems.find((id) => neutralItem.id === id)) {
            return [new Fact(lastWarnedNeutralTimeTopic, undefined)];
        }
        if (!neutralItem.canCast) {
            return [new Fact(lastWarnedNeutralTimeTopic, undefined)];
        }

        const lastWarnedTime = db.get(lastWarnedNeutralTimeTopic);
        if (!lastWarnedTime || time > lastWarnedTime + 15) {
            return [
                new Fact(lastWarnedNeutralTimeTopic, db.get(topics.time)),
                new Fact(topics.playAudioFile, "shovel.mp3"),
            ];
        }
    }
);
