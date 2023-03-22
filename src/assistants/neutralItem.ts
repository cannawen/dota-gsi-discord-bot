import { Fact, Topic } from "../Engine";
import engine from "../customEngine";
import topics from "../topics";

const lastWarnedNeutralTimeTopic = new Topic<number | undefined>(
    "lastWarnedNeutralTimeTopic"
);

engine.register(
    "assistant/neutral_item",
    [topics.items, topics.time, lastWarnedNeutralTimeTopic],
    (get) => {
        const neutralItem = get(topics.items)?.neutral;
        const time = get(topics.time);
        if (!neutralItem || !time) {
            return new Fact(lastWarnedNeutralTimeTopic, undefined);
        }
        const validNeutralItems = ["item_trusty_shovel", "item_pirate_hat"];
        if (!validNeutralItems.find((id) => neutralItem.id === id)) {
            return new Fact(lastWarnedNeutralTimeTopic, undefined);
        }
        if (!neutralItem.canCast) {
            return new Fact(lastWarnedNeutralTimeTopic, undefined);
        }

        const lastWarnedTime = get(lastWarnedNeutralTimeTopic);
        if (!lastWarnedTime || time > lastWarnedTime + 15) {
            return [
                new Fact(lastWarnedNeutralTimeTopic, get(topics.time)),
                new Fact(topics.playAudioFile, "shovel.mp3"),
            ];
        }
    }
);
