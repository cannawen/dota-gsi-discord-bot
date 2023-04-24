import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorAtMinute from "../engine/RuleDecoratorAtMinute";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.shard
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    "Reminds you of shard availability at 15:00";

export default new RuleDecoratorAtMinute(
    15,
    new RuleConfigurable(
        configTopic,
        new Rule(
            rules.assistant.shard,
            [],
            (get) => new Fact(topics.effect, "resources/audio/shard.mp3")
        )
    )
);
