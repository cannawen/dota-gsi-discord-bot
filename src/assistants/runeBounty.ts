import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
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

export default inGame(
    configurable(
        configTopic,
        new Rule({
            label: rules.assistant.runeBounty,
            trigger: [topics.time],
            then: ([time]) => {
                if (time > 0 && time % BOUNTY_RUNE_SPAWN_INTERVAL === 0) {
                    return new Fact(
                        topics.configurableEffect,
                        "resources/audio/rune-bounty.wav"
                    );
                }
            },
        })
    )
);
