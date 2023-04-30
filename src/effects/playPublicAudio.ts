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
export default new Rule({
    label: rules.effect.playAudio,
    trigger: [topics.discordAudioEnabled, topics.playPublicAudio],
    given: [topics.publicAudioQueue, topics.studentId],
    then: ([enabled, audio], [publicAudioQueue, studentId]) => {
        const queue = [...publicAudioQueue];

        if (enabled) {
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
                        studentId,
                        new Fact(topics.playPublicAudio, audio)
                    );
                });
            }
        }

        return [
            new Fact(topics.publicAudioQueue, queue),
            new Fact(topics.playPublicAudio, undefined),
        ];
    },
});
