import EffectConfig from "../EffectConfig";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(rules.assistant.glhf);
export const defaultConfig = EffectConfig.PRIVATE;

export default new RuleConfigurable(
    rules.assistant.glhf,
    configTopic,
    [topics.time, topics.inGame],
    (get, effect) => {
        const time = get(topics.time)!;
        const inGame = get(topics.inGame)!;
        if (inGame && time === 0) {
            return new Fact(effect, "resources/audio/glhf.mp3");
        }
    }
);
