import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import everyIntervalSeconds from "../engine/rules/everyIntervalSeconds";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.runeWisdom,
    "Wisdom rune",
    "Reminds you of wisdom rune every 7:00",
    EffectConfig.PUBLIC
);

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
    .map((rule) => configurable(configInfo, rule))
    .map((rule) =>
        everyIntervalSeconds(
            6 * 60 + 30,
            undefined,
            WISDOM_RUNE_SAPWN_INTERVAL,
            rule
        )
    )
    .map(inGame);
