import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import everyIntervalSeconds from "../engine/rules/everyIntervalSeconds";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

const POWER_RUNE_SPAWN_INTERVAL = 2 * 60;

export const configInfo = new ConfigInfo(
    rules.assistant.runePower,
    "Power rune",
    "Reminds you of power rune spawn every 2:00 after 6:00",
    EffectConfig.NONE
);

export default [
    new Rule({
        label: rules.assistant.runePower,
        trigger: [topics.time],
        then: () =>
            new Fact(
                topics.configurableEffect,
                "resources/audio/rune-power.wav"
            ),
    }),
]
    .map((rule) => configurable(configInfo, rule))
    .map((rule) =>
        everyIntervalSeconds(6 * 60, undefined, POWER_RUNE_SPAWN_INTERVAL, rule)
    )
    .map(inGame);
