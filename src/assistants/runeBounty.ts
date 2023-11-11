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
    rules.assistant.runeBounty,
    "Bounty rune",
    "Reminds you of bounty rune spawn every 3:00",
    EffectConfig.NONE
);

const BOUNTY_RUNE_SPAWN_INTERVAL = 3 * 60;
const BOUNTY_RUNE_START_REMINDING_TIME = BOUNTY_RUNE_SPAWN_INTERVAL;

export default [
    new Rule({
        label: "bounty rune reminder every 3 minutes",
        then: () =>
            new Fact(
                topics.configurableEffect,
                "resources/audio/rune-bounty.mp3"
            ),
    }),
]
    .map((rule) => configurable(configInfo.ruleIndentifier, rule))
    .map((rule) =>
        everyIntervalSeconds(
            BOUNTY_RUNE_START_REMINDING_TIME,
            undefined,
            BOUNTY_RUNE_SPAWN_INTERVAL,
            rule
        )
    )
    .map(inRegularGame);
