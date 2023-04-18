import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.shard
);
export const defaultConfig = EffectConfig.PUBLIC;

export default new RuleConfigurable(
    rules.assistant.shard,
    configTopic,
    [topics.time, topics.inGame],
    (get, effect) => {
        const inGame = get(topics.inGame)!;
        const time = get(topics.time)!;
        if (inGame && time === 14 * 60) {
            return new Fact(effect, "resources/audio/shard.mp3");
        }
    }
);
