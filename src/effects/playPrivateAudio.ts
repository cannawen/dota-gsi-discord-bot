import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(
    rules.effect.playPrivateAudio,
    [topics.effect.playPrivateAudioFile],
    (get) => {
        const queue = [...(get(topics.effect.privateAudioQueue) || [])];
        const fileName = get(topics.effect.playPrivateAudioFile)!;
        queue.push(fileName);

        return [
            new Fact(topics.effect.privateAudioQueue, queue),
            new Fact(topics.effect.playPrivateAudioFile, undefined),
        ];
    }
);
