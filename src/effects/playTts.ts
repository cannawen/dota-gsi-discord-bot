import topics from "../topics";
import { engine, Fact } from "../Engine";
import discord from "../discord";

engine.register({
    label: "effect/playTts",
    given: [topics.playTts],
    then: (db) => {
        const ttsMessage = db.get(topics.playTts);
        if (ttsMessage) {
            discord.playTts(ttsMessage);
        }
        engine.set(new Fact(topics.playTts, undefined));
    },
});
