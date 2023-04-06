import Config from "../configTopics";
import Fact from "../engine/Fact";
import PersistentTopic from "../engine/PersistentTopic";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import topics from "../topics";

export const configTopic = new PersistentTopic<Config>(rules.assistant.glhf, {
    persistAcrossGames: true,
    persistAcrossRestarts: true,
});
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
