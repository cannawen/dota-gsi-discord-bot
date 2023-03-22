import topics from "../topics";
import { engine, Fact } from "../Engine";
import discord from "../discord";

engine.register("effect/playTts", [topics.playTts], (db) => {
    const ttsMessage = db.get(topics.playTts);
    if (ttsMessage) {
        discord.playTts(ttsMessage);
    }
    return [new Fact(topics.playTts, undefined)];
});
