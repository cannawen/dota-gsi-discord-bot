import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
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

export default new RuleDecoratorInGame(
    new RuleConfigurable(
        rules.assistant.runeBounty,
        configTopic,
        [topics.time],
        (get, effect) => {
            const time = get(topics.time)!;
            if (time > 0 && time % BOUNTY_RUNE_SPAWN_INTERVAL === 0) {
                return new Fact(effect, "resources/audio/rune-bounty.wav");
            }
        }
    )
);
