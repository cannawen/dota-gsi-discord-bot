import betweenSeconds from "../engine/rules/betweenSeconds";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import everyIntervalSeconds from "../engine/rules/everyIntervalSeconds";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const LOTUS_SPAWN_INTERVAL = 3 * 60;

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.lotus,
    EffectConfig.PUBLIC
);
export const assistantDescription =
    "Reminds you of lotus every 3:00 before 12:00";

[
    new Rule({
        label: rules.assistant.lotus,
        trigger: [topics.time],
        then: () =>
            new Fact(
                topics.configurableEffect,
                "resources/audio/lotus-soon.mp3"
            ),
    }),
]
    .map((rule) => betweenSeconds(2 * 60 + 45, 12 * 60, rule))
    .map((rule) => configurable(configTopic, rule))
    .map((rule) => everyIntervalSeconds(LOTUS_SPAWN_INTERVAL, rule));
