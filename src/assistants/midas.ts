import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.midas
);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription = "Reminds you to use your midas";

const lastReminderTimeTopic = topicManager.createTopic<number>(
    "lastMidasReminderTimeTopic"
);

const REMINDER_INTERVAL = 15;

export default new RuleDecoratorInGame(
    new RuleDecoratorConfigurable(
        configTopic,
        new Rule({
            label: rules.assistant.midas,
            trigger: [topics.items, topics.alive, topics.time],
            then: (_t, _g, get) => {
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
                        new Fact(
                            topics.configurableEffect,
                            "resources/audio/midas.mpeg"
                        ),
                        new Fact(lastReminderTimeTopic, time),
                    ];
                }
            },
        })
    )
);
