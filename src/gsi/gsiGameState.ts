import { Dota2GameState } from "node-gsi";
import engine from "../customEngine";
import { Fact } from "../Engine";
import topics from "../topics";

engine.register("gsi/game_state", [topics.gsiData], (get) => {
    if (get(topics.gsiData)!.gameState === Dota2GameState.GameInProgress) {
        return new Fact(topics.inGame, true);
    } else {
        return new Fact(topics.inGame, false);
    }
});
