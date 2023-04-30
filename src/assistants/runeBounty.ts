import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/rules/RuleDecoratorConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const BOUNTY_RUNE_SPAWN_INTERVAL = 3 * 60;

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.runeBounty
);
export const defaultConfig = EffectConfig.NONE;
export const assistantDescription =
    "Reminds you of bounty rune spawn every 3:00";

export default inGame(
    new RuleDecoratorConfigurable(
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
