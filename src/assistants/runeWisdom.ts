import betweenSeconds from "../engine/rules/betweenSeconds";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import everyIntervalSeconds from "../engine/rules/everyIntervalSeconds";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.runeWisdom,
    "Wisdom rune",
    "Reminds you of wisdom rune every 7:00",
    EffectConfig.PUBLIC
);

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
        then: () =>
            new Fact(
                topics.configurableEffect,
                "resources/audio/wisdom-rune-soon.mp3"
            ),
    }),
]
    .map((rule) => betweenSeconds(6 * 60 + 30, undefined, rule))
    .map((rule) => configurable(configTopic, rule))
    .map((rule) => everyIntervalSeconds(WISDOM_RUNE_SAPWN_INTERVAL, rule))
    .map(inGame);
