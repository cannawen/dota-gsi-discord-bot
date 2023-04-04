import Config from "../configTopics";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import Topic from "../engine/Topic";
import topics from "../topics";

export const configTopic = new Topic<Config>(rules.assistant.glhf, true);
export const defaultConfig = Config.PRIVATE;

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
