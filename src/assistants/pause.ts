import { Config, configToEffectTopic } from "../configTopics";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import Topic from "../engine/Topic";
import topics from "../topics";

export const configTopic = new Topic<Config>(rules.assistant.pause);
export const defaultConfig = Config.PUBLIC_INTERRUPTING;

export default new Rule(
    rules.assistant.pause,
    [configTopic, topics.gsi.paused],
    (get) => {
        const effect = configToEffectTopic[get(configTopic)!];
        if (!effect) return;

        const paused = get(topics.gsi.paused)!;
        if (paused) {
            return new Fact(effect, "resources/audio/jeopardy.mp3");
        } else {
            return new Fact(topics.effect.stopAudio, true);
        }
    }
);
