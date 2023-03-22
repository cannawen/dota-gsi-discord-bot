import { engine, Fact } from "../Engine";
import topics from "../topics";

engine.register("assistant/runes", [topics.time, topics.inGame], (db) => {
    const time = db.get(topics.time);
    const inGame = db.get(topics.inGame);
    if (
        time &&
        inGame &&
        time > 0 &&
        (time % (2 * 60) === 0 || time % (3 * 60) === 0)
    ) {
        return [new Fact(topics.playAudioFile, "rune-sound.mp3")];
    }
});
