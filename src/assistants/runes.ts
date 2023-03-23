import engine from "../customEngine";
import { Fact } from "../Engine";
import topics from "../topics";

const RIVER_RUNE_SPAWN_INTERVAL = 2 * 60;
const BOUNTY_RUNE_SPAWN_INTERVAL = 3 * 60;

// If we have a time greater than 0 and are in a game
// And the time is a multiple of 2 or 3 minutes
// Play rune sound
engine.register("assistant/runes", [topics.time, topics.inGame], (get) => {
    const time = get(topics.time);
    const inGame = get(topics.inGame);
    if (
        inGame &&
        time > 0 &&
        (time % RIVER_RUNE_SPAWN_INTERVAL === 0 ||
            time % BOUNTY_RUNE_SPAWN_INTERVAL === 0)
    ) {
        return new Fact(topics.playAudioFile, "rune-sound.mp3");
    }
});
