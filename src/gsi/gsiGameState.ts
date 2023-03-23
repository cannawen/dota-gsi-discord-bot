import engine from "../customEngine";
import { Fact } from "../Engine";
import topics from "../topics";
import { Dota2GameState } from "node-gsi";

engine.register("gsi/game_state", [topics.gsiData], (get) => {
    const state = get(topics.gsiData).gameState;
    if (state === Dota2GameState.GameInProgress) {
        return new Fact(topics.inGame, true);
    } else {
        return new Fact(topics.inGame, false);
    }
});
