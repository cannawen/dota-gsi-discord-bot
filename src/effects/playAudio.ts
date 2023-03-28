import Fact from "../engine/Fact";
import path from "path";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(
    rules.effect.playAudio,
    [topics.playAudioFile],
    (get) => {
        const queue = [...(get(topics.audioQueue) || [])];
        const fileName = path.join(
            __dirname,
            "../../",
            get(topics.playAudioFile)!
        );

        queue.push(fileName);

        return [
            new Fact(topics.audioQueue, queue),
            new Fact(topics.playAudioFile, undefined),
        ];
    }
);
