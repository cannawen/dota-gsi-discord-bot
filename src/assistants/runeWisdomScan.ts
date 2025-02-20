import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import everyIntervalSeconds from "../engine/rules/everyIntervalSeconds";
import Fact from "../engine/Fact";
import inRegularGame from "../engine/rules/inRegularGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

const WISDOM_SHRINE_INTERVAL = 7 * 60;
const WISDOM_SHRINE_SCAN_WARNING_TIME = 8;

export const configInfo = new ConfigInfo(
    rules.assistant.runeWisdomScan,
    "Wisdom shrine scan",
    `Reminds you to scan on wisdom shrine ${WISDOM_SHRINE_SCAN_WARNING_TIME} seconds before spawn`,
    EffectConfig.NONE
);

export default [
    everyIntervalSeconds(
        WISDOM_SHRINE_INTERVAL - WISDOM_SHRINE_SCAN_WARNING_TIME,
        undefined,
        WISDOM_SHRINE_INTERVAL,
        new Rule({
            label: `reminder to scan wisdom shrine ${WISDOM_SHRINE_SCAN_WARNING_TIME} seconds prior`,
            trigger: [topics.time],
            then: () =>
                new Fact(topics.configurableEffect, "scan on wisdom shrine."),
        })
    ),
]
    .map((rule) => configurable(configInfo.ruleIndentifier, rule))
    .map(inRegularGame);
