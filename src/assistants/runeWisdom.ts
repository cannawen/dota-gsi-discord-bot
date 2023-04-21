import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.runeWisdom
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    "Reminds you of wisdom rune every 7 minutes";

export default new RuleDecoratorInGame(
    new RuleConfigurable(
        rules.assistant.runeWisdom,
        configTopic,
        [topics.time],
        (get, effect) => {
            const time = get(topics.time)!;
            if (time > 0 && time % (7 * 60) === 0) {
                return new Fact(effect, "wisdom rune");
            }
        }
    )
);
