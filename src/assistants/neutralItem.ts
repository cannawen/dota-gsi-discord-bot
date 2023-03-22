import { engine, Fact, Topic } from "../Engine";
import topics from "../topics";

const lastWarnedNeutralTimeTopic = new Topic<number | undefined>(
    "lastWarnedNeutralTime"
);

engine.register({
    label: "assistant/neutral_item",
    given: [topics.items, topics.time, lastWarnedNeutralTimeTopic],
    when: (db) => {
        const neutralItem = db.get(topics.items)?.neutral;
        const time = db.get(topics.time);
        if (!neutralItem || !time) {
            return false;
        }
        const validNeutralItems = ["item_trusty_shovel", "item_pirate_hat"];
        if (!validNeutralItems.find((id) => neutralItem.id === id)) {
            return false;
        }
        if (!neutralItem.canCast) {
            return false;
        }

        const lastWarnedTime = db.get(lastWarnedNeutralTimeTopic) || 0;
        return time > lastWarnedTime + 15;
    },
    then: (db) => {
        const currentTime = db.get(topics.time);
        engine.set(
            new Fact(lastWarnedNeutralTimeTopic, currentTime),
            new Fact(topics.playAudioFile, "shovel.mp3")
        );
    },
});
