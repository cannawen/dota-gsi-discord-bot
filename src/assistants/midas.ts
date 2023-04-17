import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.midas
);
export const defaultConfig = EffectConfig.PRIVATE;

const lastReminderTimeTopic = topicManager.createTopic<number>(
    "lastMidasReminderTimeTopic"
);

const REMINDER_INTERVAL = 15;

export default new RuleConfigurable(
    rules.assistant.midas,
    configTopic,
    [topics.items, topics.alive, topics.time],
    (get, effect) => {
        if (!get(topics.alive)!) {
            return new Fact(lastReminderTimeTopic, undefined);
        }

        const items = get(topics.items)!;
        const midas = [...items.inventory, ...items.backpack]
            .filter((item) => item !== null)
            .find((item) => item!.id === "item_hand_of_midas");

        if (midas === undefined || midas!.cooldown! > 0) {
            return new Fact(lastReminderTimeTopic, undefined);
        }

        const time = get(topics.time)!;
        const lastReminderTime = get(lastReminderTimeTopic);

        if (lastReminderTime === undefined) {
            return new Fact(lastReminderTimeTopic, time);
        }
        if (time >= lastReminderTime + REMINDER_INTERVAL) {
            return [
                new Fact(effect, "resources/audio/midas.mpeg"),
                new Fact(lastReminderTimeTopic, time),
            ];
        }
    }
);
