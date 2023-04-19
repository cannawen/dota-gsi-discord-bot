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
    [topics.playDiscordAudio, topics.discordAudioEnabled],
    (get) => {
        if (get(topics.discordAudioEnabled)!) {
            const queue = [...(get(topics.publicAudioQueue) || [])];
            const fileName = path.join(
                __dirname,
                "../../",
                get(topics.playDiscordAudio)!
            );

            queue.push(fileName);

            return [
                new Fact(topics.publicAudioQueue, queue),
                new Fact(topics.playDiscordAudio, undefined),
            ];
        } else {
            return new Fact(topics.playDiscordAudio, undefined);
        }
    }
);
