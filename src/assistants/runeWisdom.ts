import betweenMinutes from "../engine/rules/betweenMinutes";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import everyIntervalSeconds from "../engine/rules/everyIntervalSeconds";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.runeWisdom,
    EffectConfig.PUBLIC
);
export const assistantDescription = "Reminds you of wisdom rune every 7:00";

const WISDOM_RUNE_SAPWN_INTERVAL = 7 * 60;

export default [
    new Rule({
        label: rules.assistant.runeWisdom,
        trigger: [topics.time],
        then: () => new Fact(topics.configurableEffect, "wisdom rune soon"),
    }),
]
    .map((rule) => betweenMinutes(6.5, undefined, rule))
    .map((rule) => configurable(configTopic, rule))
    .map((rule) => everyIntervalSeconds(WISDOM_RUNE_SAPWN_INTERVAL, rule))
    .map(inGame);
