import { engine, Fact } from "../Engine";
import topics from "../topics";

engine.register("assistant/runes", [topics.time], (db) => {
    const time = db.get(topics.time);
    if (time && time > 0 && (time % (2 * 60) === 0 || time % (3 * 60) === 0)) {
        engine.set(new Fact(topics.playAudioFile, "rune-sound.mp3"));
    }
});
