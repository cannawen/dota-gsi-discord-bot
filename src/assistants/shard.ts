import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorAtMinute from "../engine/RuleDecoratorAtMinute";
import rules from "../rules";
import topicManager from "../engine/topicManager";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.shard
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    "Reminds you of shard availability at 15:00";

export default new RuleDecoratorAtMinute(
    15,
    new RuleConfigurable(
        rules.assistant.shard,
        configTopic,
        [],
        (get, effect) => new Fact(effect, "resources/audio/shard.mp3")
    )
);
