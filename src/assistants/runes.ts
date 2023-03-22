import { engine, Fact } from "../Engine";
import topics from "../topics";

engine.register({
    label: "assistant/runes",
    given: [topics.time],
    when: (db) => {
        const time = db.get(topics.time);
        if (time) {
            return time > 0 && (time % (2 * 60) === 0 || time % (3 * 60) === 0);
        } else {
            return false;
        }
    },
    then: (db) => {
        engine.set(new Fact(topics.playAudioFile, "rune-sound.mp3"));
    },
});
