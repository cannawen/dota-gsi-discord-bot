import Config from "../configTopics";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import Topic from "../engine/Topic";
import topics from "../topics";

export const configTopic = new Topic<Config>(rules.assistant.pause);
export const defaultConfig = Config.PUBLIC_INTERRUPTING;

export default new RuleConfigurable(
    rules.assistant.pause,
    configTopic,
    [topics.gsi.paused],
    (get, effect) => {
        const paused = get(topics.gsi.paused)!;
        if (paused) {
            return new Fact(effect, "resources/audio/jeopardy.mp3");
        } else {
            return new Fact(topics.effect.stopAudio, true);
        }
    }
);
