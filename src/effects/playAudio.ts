import Fact from "../engine/Fact";
import path from "path";
import Rule from "../engine/Rule";
import rules from "../rules";
import topic from "../topic";

export default new Rule(
    rules.effect.playAudio,
    [topic.playAudioFile],
    (get) => {
        const queue = [...(get(topic.audioQueue) || [])];
        const fileName = path.join(
            __dirname,
            "../../",
            get(topic.playAudioFile)!
        );

        queue.push(fileName);

        return [
            new Fact(topic.audioQueue, queue),
            new Fact(topic.playAudioFile, undefined),
        ];
    }
);
