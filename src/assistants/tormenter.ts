import atMinute from "../engine/rules/atMinute";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inRegularGame from "../engine/rules/inRegularGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.tormenter,
    "Tormenter",
    "Reminds you of tormenter spawn at 15:00",
    EffectConfig.PUBLIC
);

export default [
    atMinute(
        15,
        new Rule({
            label: rules.assistant.tormenter,
            then: () => new Fact(topics.configurableEffect, "tormenter's up."),
        })
    ),
]
    .map(inRegularGame)
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
