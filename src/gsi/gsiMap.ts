import { Dota2GameState } from "node-gsi";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

/**
 * Backfills time facts for any time ticks that we may have skipped
 * If time jump is greater than 5 seconds, does not backfill.
 * TODO needs tests
 */
function getTimeFacts(oldTime: number | undefined, newTime: number) {
    const timeFacts = [];
    if (oldTime && newTime > oldTime + 1 && newTime <= oldTime + 5) {
        // eslint-disable-next-line no-loops/no-loops
        for (let i = oldTime + 1; i < newTime; i++) {
            timeFacts.push(new Fact(topics.time, i));
        }
    }
    timeFacts.push(new Fact(topics.time, newTime));
    return timeFacts;
}

export default new Rule({
    label: rules.gsi.map,
    trigger: [topics.allData],
    given: [topics.time],
    then: ([data], [time]) => {
        const map = data.map;
        if (map) {
            return [
                new Fact(topics.inGame, map.gameState === Dota2GameState.GameInProgress),
                new Fact(topics.preGame, map.gameState === Dota2GameState.PreGame),
                ...getTimeFacts(time, map.clockTime),
                new Fact(topics.daytime, map.dayTime),
                new Fact(topics.paused, map.paused),
                new Fact(topics.customGameName, map.customgamename),
            ];
        }
    },
});
