import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import everyIntervalSeconds from "../engine/rules/everyIntervalSeconds";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.lotus,
    "Healing lotus",
    "Reminds you of lotus every 3:00 before 12:00",
    EffectConfig.PUBLIC
);

const LOTUS_SPAWN_INTERVAL = 3 * 60;
const LOTUS_START_WARNING_TIME = 3 * 60 - 15;
const LOTUS_STOP_WARNING_TIME = 12 * 60;

export default [
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
    .map((rule) => configurable(configInfo.ruleIndentifier, rule))
    .map((rule) =>
        everyIntervalSeconds(
            LOTUS_START_WARNING_TIME,
            LOTUS_STOP_WARNING_TIME,
            LOTUS_SPAWN_INTERVAL,
            rule
        )
    );
