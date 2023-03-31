import { Config, configToEffectTopic } from "../configTopics";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import Topic from "../engine/Topic";
import topics from "../topics";

export const configTopic = new Topic<Config>(rules.assistant.glhf);
export const defaultConfig = Config.PRIVATE;

export default new Rule(
    rules.assistant.glhf,
    [configTopic, topics.gsi.time, topics.gsi.inGame],
    (get) => {
        const effect = configToEffectTopic[get(configTopic)!];
        if (!effect) return;

        const time = get(topics.gsi.time)!;
        const inGame = get(topics.gsi.inGame)!;
        if (inGame && time === 0) {
            return new Fact(effect, "resources/audio/glhf.mp3");
        }
    }
);
