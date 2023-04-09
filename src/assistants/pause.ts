import EffectConfig from "../EffectConfig";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.pause
);
export const defaultConfig = EffectConfig.PUBLIC_INTERRUPTING;

export default new RuleConfigurable(
    rules.assistant.pause,
    configTopic,
    [topics.paused],
    (get, effect) => {
        const paused = get(topics.paused)!;
        if (paused) {
            return new Fact(effect, "resources/audio/jeopardy.mp3");
        } else {
            return new Fact(topics.stopAudio, true);
        }
    }
);
