import { Dota2GameState } from "node-gsi";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

function inGame(state: Dota2GameState | undefined) {
    if (state) {
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
    } else {
        return false;
    }
}

export default [
    new Rule(rules.gsi.map.time, [topics.gsi.allData], (get) => [
        new Fact(topics.gsi.time, get(topics.gsi.allData)!.map?.clockTime),
    ]),
    new Rule(rules.gsi.map.inGame, [topics.gsi.allData], (get) => [
        new Fact(
            topics.gsi.inGame,
            inGame(get(topics.gsi.allData)!.map?.gameState)
        ),
    ]),
    new Rule(rules.gsi.map.paused, [topics.gsi.allData], (get) => [
        new Fact(topics.gsi.paused, get(topics.gsi.allData)!.map?.paused),
    ]),
];
