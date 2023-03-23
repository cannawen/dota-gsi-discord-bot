import discord from "../discord";
import engine from "../customEngine";
import { Fact } from "../Engine";
import topics from "../topics";

engine.register("effect/playTts", [topics.playTts], (get) => {
    discord.playTts(get(topics.playTts));
    return new Fact(topics.playTts, undefined);
});
