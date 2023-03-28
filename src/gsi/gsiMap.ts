import { Dota2GameState } from "node-gsi";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topic from "../topic";

export default [
    new Rule(rules.gsi.map.time, [topic.gsiData], (get) => [
        new Fact(topic.time, get(topic.gsiData)!.map?.clockTime),
    ]),
    new Rule(rules.gsi.map.inGame, [topic.gsiData], (get) => [
        new Fact(
            topic.inGame,
            get(topic.gsiData)!.map?.gameState === Dota2GameState.GameInProgress
        ),
    ]),
];
