import engine from "../customEngine";
import Fact from "../engine/Fact";
import fs from "fs";
import path from "path";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";
import tts from "./tts";

/**
 * The actual playing happens in discord/playAudioQueue
 */
export default new Rule(
    rules.effect.playAudio,
    [topics.playPublicAudio, topics.discordAudioEnabled],
    (get) => {
        const audio = get(topics.playPublicAudio)!;
        const queue = [...(get(topics.publicAudioQueue) || [])];

        if (get(topics.discordAudioEnabled)!) {
            const hardCodedFile = path.join(__dirname, "../../", audio);
            const cachedTtsFile = path.join(
                __dirname,
                "../../",
                tts.path(audio)
            );

            if (fs.existsSync(hardCodedFile)) {
                queue.push(hardCodedFile);
            } else if (fs.existsSync(cachedTtsFile)) {
                queue.push(cachedTtsFile);
            } else {
                tts.create(audio).then(() => {
                    engine.setFact(
                        get(topics.studentId)!,
                        new Fact(topics.playPublicAudio, audio)
                    );
                });
            }
        }

        return [
            new Fact(topics.publicAudioQueue, queue),
            new Fact(topics.playPublicAudio, undefined),
        ];
    }
);
