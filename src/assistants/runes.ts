import Config from "../configTopics";
import Fact from "../engine/Fact";
import PersistentTopic from "../engine/PersistentTopic";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import topics from "../topics";

const RIVER_RUNE_SPAWN_INTERVAL = 2 * 60;
const BOUNTY_RUNE_SPAWN_INTERVAL = 3 * 60;

export const configTopic = new PersistentTopic<Config>(rules.assistant.runes, {
    persistForever: true,
});
export const defaultConfig = Config.PRIVATE;

// If we have a time greater than 0 and are in a game
// And the time is a multiple of 2 or 3 minutes
// Play rune sound
export default new RuleConfigurable(
    rules.assistant.runes,
    configTopic,
    [topics.inGame, topics.time],
    (get, effect) => {
        const inGame = get(topics.inGame)!;
        const time = get(topics.time)!;
        if (
            inGame &&
            time > 0 &&
            (time % RIVER_RUNE_SPAWN_INTERVAL === 0 ||
                time % BOUNTY_RUNE_SPAWN_INTERVAL === 0)
        ) {
            return new Fact(effect, "resources/audio/rune-sound.mp3");
        }
    }
);
