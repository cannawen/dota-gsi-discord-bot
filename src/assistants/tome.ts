import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(rules.assistant.tome);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription = "Reminds you of tome restock";

export default new RuleConfigurable(
    rules.assistant.tome,
    configTopic,
    [topics.time, topics.inGame],
    (get, effect) => {
        const inGame = get(topics.inGame)!;
        const time = get(topics.time)!;
        if (inGame && time > 0 && time % (10 * 60) === 0) {
            return new Fact(effect, "resources/audio/tome.mp3");
        }
    }
);
