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
    [topics.playPublicAudioFile],
    (get) => {
        const queue = [...(get(topics.publicAudioQueue) || [])];
        const fileName = path.join(
            __dirname,
            "../../",
            get(topics.playPublicAudioFile)!
        );

        queue.push(fileName);

        return [
            new Fact(topics.publicAudioQueue, queue),
            new Fact(topics.playPublicAudioFile, undefined),
        ];
    }
);
