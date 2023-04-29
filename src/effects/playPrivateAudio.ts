import engine from "../customEngine";
import Fact from "../engine/Fact";
import fs from "fs";
import path from "path";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";
import tts from "./tts";

/**
 * The actual playing happens in server /coach/:studentId/poll
 */
export default new Rule({
    label: rules.effect.playPrivateAudio,
    trigger: [topics.playPrivateAudio],
    then: (_t, _g, get) => {
        const audio = get(topics.playPrivateAudio)!;
        const queue = [...(get(topics.privateAudioQueue) || [])];

        const hardCodedFile = path.join(__dirname, "../../", audio);
        const cachedTtsFile = path.join(__dirname, "../../", tts.path(audio));

        if (fs.existsSync(hardCodedFile)) {
            queue.push(audio);
        } else if (fs.existsSync(cachedTtsFile)) {
            queue.push(tts.path(audio));
        } else {
            tts.create(audio).then(() => {
                engine.setFact(
                    get(topics.studentId)!,
                    new Fact(topics.playPrivateAudio, audio)
                );
            });
        }

        return [
            new Fact(topics.privateAudioQueue, queue),
            new Fact(topics.playPrivateAudio, undefined),
        ];
    },
});
