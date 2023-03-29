import Fact from "../engine/Fact";
import path from "path";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(
    rules.effect.playPrivateAudio,
    [topics.playPrivateAudioFile],
    (get) => {
        const queue = [...(get(topics.privateAudioQueue) || [])];
        const fileName = get(topics.playPrivateAudioFile)!;
        queue.push(fileName);

        return [
            new Fact(topics.privateAudioQueue, queue),
            new Fact(topics.playPrivateAudioFile, undefined),
        ];
    }
);
