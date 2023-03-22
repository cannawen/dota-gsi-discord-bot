import { engine, Fact } from "../Engine";
import topics from "../topics";
import { Dota2GameState } from "node-gsi";

engine.register({
    label: "gsi/game_state",
    given: [topics.gsiData],
    then: (db) => {
        const state = db.get(topics.gsiData).gameState;
        if (state === Dota2GameState.GameInProgress) {
            return [new Fact(topics.inGame, true)];
        } else {
            return [new Fact(topics.inGame, false)];
        }
    },
});
