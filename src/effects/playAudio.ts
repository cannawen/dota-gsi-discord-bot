import Fact from "../engine/Fact";
import path from "path";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

/**
 * The actual playing happens in discord/playAudioQueue
 */
export default new Rule(
    rules.effect.playAudio,
    [topics.effect.playAudioFile],
    (get) => {
        const queue = [...(get(topics.effect.audioQueue) || [])];
        const fileName = path.join(
            __dirname,
            "../../",
            get(topics.effect.playAudioFile)!
        );

        queue.push(fileName);

        return [
            new Fact(topics.effect.audioQueue, queue),
            new Fact(topics.effect.playAudioFile, undefined),
        ];
    }
);
