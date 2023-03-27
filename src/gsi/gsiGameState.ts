import { Dota2GameState } from "node-gsi";
import engine from "../customEngine";
import Fact from "../classes/engine/Fact";
import Rule from "../classes/engine/Rule";
import topic from "../topic";

engine.register(
    new Rule("gsi/game_state", [topic.gsiData], (get) => {
        if (get(topic.gsiData)!.gameState === Dota2GameState.GameInProgress) {
            return new Fact(topic.inGame, true);
        } else {
            return new Fact(topic.inGame, false);
        }
    })
);
