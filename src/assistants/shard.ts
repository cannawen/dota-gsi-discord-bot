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
export const assistantDescription =
    "Reminds you of shard availability at 15:00";

export default new RuleConfigurable(
    rules.assistant.shard,
    configTopic,
    [topics.time],
    (get, effect) => {
        if (!get(topics.inGame)!) return;

        const time = get(topics.time)!;
        if (time === 15 * 60) {
            return new Fact(effect, "resources/audio/shard.mp3");
        }
    }
);
