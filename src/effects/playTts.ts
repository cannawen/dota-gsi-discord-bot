import discord from "../discord";
import engine from "../CustomEngine";
import { Fact } from "../Engine";
import topics from "../topics";

engine.register("effect/playTts", [topics.playTts], (get) => {
    const ttsMessage = get(topics.playTts);
    if (ttsMessage) {
        discord.playTts(ttsMessage);
    }
    return [new Fact(topics.playTts, undefined)];
});
