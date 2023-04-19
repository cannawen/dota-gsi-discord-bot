import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const POWER_RUNE_START_SPAWN_TIME = 6 * 60;
const POWER_RUNE_SPAWN_INTERVAL = 2 * 60;

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.runePower
);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription =
    "Reminds you of power rune spawn every 2:00 after 6:00";

export default new RuleConfigurable(
    rules.assistant.runePower,
    configTopic,
    [topics.inGame, topics.time],
    (get, effect) => {
        const inGame = get(topics.inGame)!;
        const time = get(topics.time)!;
        if (
            inGame &&
            time >= POWER_RUNE_START_SPAWN_TIME &&
            time % POWER_RUNE_SPAWN_INTERVAL === 0
        ) {
            return new Fact(effect, "resources/audio/rune-power.wav");
        }
    }
);
