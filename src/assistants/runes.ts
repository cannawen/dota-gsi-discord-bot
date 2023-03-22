import engine from "../customEngine";
import { Fact } from "../Engine";
import topics from "../topics";

engine.register("assistant/runes", [topics.time, topics.inGame], (get) => {
    const time = get(topics.time);
    const inGame = get(topics.inGame);
    if (
        time &&
        inGame &&
        time > 0 &&
        (time % (2 * 60) === 0 || time % (3 * 60) === 0)
    ) {
        return [new Fact(topics.playAudioFile, "rune-sound.mp3")];
    }
});
