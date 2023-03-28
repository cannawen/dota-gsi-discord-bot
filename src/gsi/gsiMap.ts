import { Dota2GameState } from "node-gsi";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import topic from "../topic";

export default [
    new Rule("gsi/map->time", [topic.gsiData], (get) => [
        new Fact(topic.time, get(topic.gsiData)!.map?.gameTime),
    ]),
    new Rule("gsi/map->game_state", [topic.gsiData], (get) => [
        new Fact(
            topic.inGame,
            get(topic.gsiData)!.map?.gameState === Dota2GameState.GameInProgress
        ),
    ]),
];
