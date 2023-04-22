import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import RuleDecoratorMinAndMaxMinute from "../engine/RuleDecoratorMixAndMaxMinute";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const POWER_RUNE_SPAWN_INTERVAL = 2 * 60;

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.runePower
);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription =
    "Reminds you of power rune spawn every 2:00 after 6:00";

export default new RuleDecoratorMinAndMaxMinute(
    6,
    undefined,
    new RuleDecoratorInGame(
        new RuleConfigurable(
            rules.assistant.runePower,
            configTopic,
            [topics.time],
            (get, effect) => {
                const time = get(topics.time)!;
                if (time % POWER_RUNE_SPAWN_INTERVAL === 0) {
                    return new Fact(effect, "resources/audio/rune-power.wav");
                }
            }
        )
    )
);
