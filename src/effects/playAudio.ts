import topics from "../topics";
import { engine, Fact } from "../Engine";
import discord from "../discord";
import path from "path";

engine.register("effect/playAudio", [topics.playAudioFile], (db) => {
    const audioFile = db.get(topics.playAudioFile);
    if (audioFile) {
        discord.playAudioFile(path.join(__dirname, "../../audio/", audioFile));
    }

    engine.set(new Fact(topics.playAudioFile, undefined));
});
