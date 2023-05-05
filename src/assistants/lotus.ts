import betweenMinutes from "../engine/rules/betweenMinutes";
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
        then: () => new Fact(topics.configurableEffect, "healing lotus soon"),
    }),
]
    .map((rule) => betweenMinutes(2.75, 12, rule))
    .map((rule) => configurable(configTopic, rule))
    .map((rule) => everyIntervalSeconds(LOTUS_SPAWN_INTERVAL, rule));
