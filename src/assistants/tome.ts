import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(rules.assistant.tome);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription = "Reminds you of tome restock";

export default new RuleDecoratorInGame(
    new RuleConfigurable(
        rules.assistant.tome,
        configTopic,
        [topics.time],
        (get, effect) => {
            const time = get(topics.time)!;
            if (time > 0 && time % (10 * 60) === 0) {
                return new Fact(effect, "resources/audio/tome.mp3");
            }
        }
    )
);
