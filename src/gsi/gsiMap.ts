import { Dota2GameState } from "node-gsi";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

function inGame(state: Dota2GameState) {
    switch (state) {
        case Dota2GameState.GameInProgress:
            return true;
        case Dota2GameState.Init:
        case Dota2GameState.HeroSelection:
        case Dota2GameState.StrategyTime:
        case Dota2GameState.TeamShowcase:
        case Dota2GameState.PreGame:
        case Dota2GameState.PostGame:
        default:
            return false;
    }
}

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

export default new Rule(rules.gsi.map, [topics.allData], (get) => {
    const map = get(topics.allData)!.map;
    if (map) {
        return [
            ...getTimeFacts(get(topics.time), map.clockTime),
            new Fact(topics.dayTime, map.dayTime),
            new Fact(topics.inGame, inGame(map.gameState)),
            new Fact(topics.paused, map.paused),
        ];
    }
});
