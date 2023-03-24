import engine from "../customEngine";
import { Fact } from "../Engine";
import path from "path";
import topics from "../topics";

engine.register("effect/playAudio", [topics.playAudioFile], (get) => {
    const queue = [...(get(topics.discordAudioQueue) || [])];
    const fileName = path.join(__dirname, "../../", get(topics.playAudioFile)!);

    queue.push(fileName);

    return [
        new Fact(topics.discordAudioQueue, queue),
        new Fact(topics.playAudioFile, undefined),
    ];
});
