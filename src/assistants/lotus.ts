import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
import RuleDecoratorStartAndEndMinute from "../engine/RuleDecoratorStartAndEndMinute";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const LOTUS_SPAWN_INTERVAL = 3 * 60;
const ADVANCED_WARNING = 10;

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.lotus
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    "Reminds you of lotus every 3:00 before 12:00";

export default new RuleDecoratorStartAndEndMinute(
    0,
    12,
    new RuleDecoratorConfigurable(
        configTopic,
        new Rule(rules.assistant.lotus, [topics.time], (get) => {
            const time = get(topics.time)!;
            if ((time + ADVANCED_WARNING) % LOTUS_SPAWN_INTERVAL === 0) {
                return new Fact(topics.configurableEffect, "resources/audio/lotus-soon.mp3");
            }
        })
    )
);
