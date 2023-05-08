import betweenSeconds from "../engine/rules/betweenSeconds";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import everyIntervalSeconds from "../engine/rules/everyIntervalSeconds";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

const BOUNTY_RUNE_SPAWN_INTERVAL = 3 * 60;

export const configInfo = new ConfigInfo(
    rules.assistant.runeBounty,
    "Bounty rune",
    "Reminds you of bounty rune spawn every 3:00",
    EffectConfig.NONE
);

export default [
    new Rule({
        label: rules.assistant.runeBounty,
        then: () =>
            new Fact(
                topics.configurableEffect,
                "resources/audio/rune-bounty.wav"
            ),
    }),
]
    .map((rule) => betweenSeconds(3 * 60, undefined, rule))
    .map((rule) => configurable(configInfo, rule))
    .map((rule) => everyIntervalSeconds(BOUNTY_RUNE_SPAWN_INTERVAL, rule))
    .map(inGame);
