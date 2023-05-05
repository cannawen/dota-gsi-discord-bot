import betweenMinutes from "../engine/rules/betweenMinutes";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import everyIntervalSeconds from "../engine/rules/everyIntervalSeconds";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const BOUNTY_RUNE_SPAWN_INTERVAL = 3 * 60;

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.runeBounty,
    EffectConfig.NONE
);
export const assistantDescription =
    "Reminds you of bounty rune spawn every 3:00";

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
    .map((rule) => betweenMinutes(3, undefined, rule))
    .map((rule) => configurable(configTopic, rule))
    .map((rule) =>
        everyIntervalSeconds(
            BOUNTY_RUNE_SPAWN_INTERVAL,
            rules.assistant.runeBounty,
            rule
        )
    )
    .map(inGame);
