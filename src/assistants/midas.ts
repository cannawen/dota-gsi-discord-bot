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
            trigger: [topics.alive, topics.items, topics.time],
            given: [lastReminderTimeTopic],
            then: ([alive, items, time], [lastReminderTime]) => {
                if (!alive) {
                    return new Fact(lastReminderTimeTopic, undefined);
                }

                const midas = [...items.inventory, ...items.backpack]
                    .filter((item) => item !== null)
                    .find((item) => item!.id === "item_hand_of_midas");

                if (midas === undefined || midas!.cooldown! > 0) {
                    return new Fact(lastReminderTimeTopic, undefined);
                }

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
