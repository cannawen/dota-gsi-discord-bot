import Config from "../configTopics";
import Fact from "../engine/Fact";
import PersistentTopic from "../engine/PersistentTopic";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import topics from "../topics";

export const configTopic = new PersistentTopic<Config>(rules.assistant.pause, {
    persistForever: true,
});
export const defaultConfig = Config.PUBLIC_INTERRUPTING;

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
