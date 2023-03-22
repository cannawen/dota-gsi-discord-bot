import discord from "../discord";
import engine from "../customEngine";
import { Fact } from "../Engine";
import path from "path";
import topics from "../topics";

engine.register("effect/playAudio", [topics.playAudioFile], (get) => {
    const audioFile = get(topics.playAudioFile);
    if (audioFile) {
        discord.playAudioFile(path.join(__dirname, "../../audio/", audioFile));
    }

    return [new Fact(topics.playAudioFile, undefined)];
});
