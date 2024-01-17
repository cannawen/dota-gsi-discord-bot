import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import everyIntervalSeconds from "../engine/rules/everyIntervalSeconds";
import Fact from "../engine/Fact";
import inRegularGame from "../engine/rules/inRegularGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

const WISDOM_RUNE_INTERVAL = 7 * 60;
const WISDOM_RUNE_SCAN_WARNING_TIME = 8;

export const configInfo = new ConfigInfo(
    rules.assistant.runeWisdomScan,
    "Wisdom rune scan",
    `Reminds you to scan for wisdom rune ${WISDOM_RUNE_SCAN_WARNING_TIME} seconds before spawn`,
    EffectConfig.PUBLIC
);

export default [
    everyIntervalSeconds(
        WISDOM_RUNE_INTERVAL - WISDOM_RUNE_SCAN_WARNING_TIME,
        undefined,
        WISDOM_RUNE_INTERVAL,
        new Rule({
            label: `reminder to scan wisdom rune ${WISDOM_RUNE_SCAN_WARNING_TIME} seconds prior`,
            trigger: [topics.time],
            then: () =>
                new Fact(topics.configurableEffect, "scan for wisdom rune."),
        })
    ),
]
    .map((rule) => configurable(configInfo.ruleIndentifier, rule))
    .map(inRegularGame);
