import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.tormenter
);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription = "Reminds you of tormenter";

export default new RuleDecoratorInGame(
    new RuleConfigurable(
        rules.assistant.tormenter,
        configTopic,
        [topics.time],
        (get, effect) => {
            const time = get(topics.time)!;
            if (time === 20 * 60) {
                return new Fact(effect, "tormenter");
            }
        }
    )
);
