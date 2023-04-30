import configurable from "../engine/rules/configurable";
import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleDecoratorStartAndEndMinute from "../engine/rules/RuleDecoratorStartAndEndMinute";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const LOTUS_SPAWN_INTERVAL = 3 * 60;
const ADVANCED_WARNING = 15;

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.lotus
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    "Reminds you of lotus every 3:00 before 12:00";

export default new RuleDecoratorStartAndEndMinute(
    0,
    12,
    configurable(
        configTopic,
        new Rule({
            label: rules.assistant.lotus,
            trigger: [topics.time],
            when: ([time]) =>
                (time + ADVANCED_WARNING) % LOTUS_SPAWN_INTERVAL === 0,
            then: () =>
                new Fact(
                    topics.configurableEffect,
                    "resources/audio/lotus-soon.mp3"
                ),
        })
    )
);
