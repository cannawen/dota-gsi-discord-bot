import { Dota2GameState } from "node-gsi";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default [
    new Rule(rules.gsi.map.time, [topics.gsiData], (get) => [
        new Fact(topics.time, get(topics.gsiData)!.map?.clockTime),
    ]),
    new Rule(rules.gsi.map.inGame, [topics.gsiData], (get) => [
        new Fact(
            topics.inGame,
            get(topics.gsiData)!.map?.gameState ===
                Dota2GameState.GameInProgress
        ),
    ]),
];
