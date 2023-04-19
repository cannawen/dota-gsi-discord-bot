import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(
    rules.effect.playPrivateAudio,
    [topics.playPrivateAudio],
    (get) => {
        const queue = [...(get(topics.privateAudioQueue) || [])];
        const fileName = get(topics.playPrivateAudio)!;
        queue.push(fileName);

        return [
            new Fact(topics.privateAudioQueue, queue),
            new Fact(topics.playPrivateAudio, undefined),
        ];
    }
);
