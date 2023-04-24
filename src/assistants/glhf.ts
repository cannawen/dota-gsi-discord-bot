import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(rules.assistant.glhf);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription =
    "Wishes you good fortune at the start of the game";

export default new RuleDecoratorConfigurable(
    configTopic,
    new Rule(rules.assistant.glhf, [topics.inGame, topics.time], (get) => {
        if (get(topics.time)! === 0 && get(topics.inGame)! === true) {
            return new Fact(topics.effect, "resources/audio/glhf.mp3");
        }
    })
);
