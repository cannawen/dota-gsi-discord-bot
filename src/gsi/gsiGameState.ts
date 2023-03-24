import { Dota2GameState } from "node-gsi";
import engine from "../customEngine";
import { Fact } from "../Engine";
import topic from "../topic";

engine.register("gsi/game_state", [topic.gsiData], (get) => {
    if (get(topic.gsiData)!.gameState === Dota2GameState.GameInProgress) {
        return new Fact(topic.inGame, true);
    } else {
        return new Fact(topic.inGame, false);
    }
});
