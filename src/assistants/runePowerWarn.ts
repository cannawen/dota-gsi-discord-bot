import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import everyIntervalSeconds from "../engine/rules/everyIntervalSeconds";
import Fact from "../engine/Fact";
import inRegularGame from "../engine/rules/inRegularGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.runePowerWarn,
    "Power rune warning",
    "Reminds you 30 seconds before power runes spawn (from times 6-20m)",
    EffectConfig.NONE
);

const POWER_RUNE_SPAWN_INTERVAL = 2 * 60;
const POWER_RUNE_START_REMINDER_TIME = 6 * 60 - 30;
const POWER_RUNE_END_REMINDER_TIME = 20 * 60;

export default [
    new Rule({
        label: "power rune reminder every 2 minutes (30 seconds beforehand)",
        trigger: [topics.time],
        then: () => new Fact(topics.configurableEffect, "power rune soon."),
    }),
]
    .map((rule) => configurable(configInfo.ruleIndentifier, rule))
    .map((rule) =>
        everyIntervalSeconds(
            POWER_RUNE_START_REMINDER_TIME,
            POWER_RUNE_END_REMINDER_TIME,
            POWER_RUNE_SPAWN_INTERVAL,
            rule
        )
    )
    .map(inRegularGame);
