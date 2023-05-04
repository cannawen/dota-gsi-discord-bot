import betweenMinutes from "../engine/rules/betweenMinutes";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const LOTUS_SPAWN_INTERVAL = 3 * 60;
const ADVANCED_WARNING = 15;

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.lotus,
    EffectConfig.PUBLIC
);
export const assistantDescription =
    "Reminds you of lotus every 3:00 before 12:00";

export default betweenMinutes(
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
                new Fact(topics.configurableEffect, "healing lotus soon"),
        })
    )
);
