import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

const RIVER_RUNE_SPAWN_INTERVAL = 2 * 60;
const BOUNTY_RUNE_SPAWN_INTERVAL = 3 * 60;

// If we have a time greater than 0 and are in a game
// And the time is a multiple of 2 or 3 minutes
// Play rune sound
export default new Rule(
    rules.assistant.runes,
    [topics.inGame, topics.time],
    (get) => {
        const inGame = get(topics.inGame)!;
        const time = get(topics.time)!;
        if (
            inGame &&
            time > 0 &&
            (time % RIVER_RUNE_SPAWN_INTERVAL === 0 ||
                time % BOUNTY_RUNE_SPAWN_INTERVAL === 0)
        ) {
            return new Fact(
                topics.playPrivateAudioFile,
                "resources/audio/rune-sound.mp3"
            );
        }
    }
);
