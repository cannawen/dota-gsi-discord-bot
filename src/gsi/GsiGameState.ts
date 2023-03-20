import {
    IDota2ObserverState, IDota2State,
} from "node-gsi";
import broker from "../broker";
import gsi = require("node-gsi");
import log from "../log";
import Topic from "../Topic";

class GsiGameState {
    private inGame = false;

    private isInGame(newInGame: boolean) {
        if (this.inGame !== newInGame) {
            this.inGame = newInGame;
        }
    }

    public handleState(state: IDota2State | IDota2ObserverState): boolean {
        if (state.map?.gameState) {
            log.debug("gsi", "map.gameState %s", state.map.gameState);
            switch (state.map?.gameState) {
                case gsi.Dota2GameState.PreGame:
                case gsi.Dota2GameState.TeamShowcase:
                case gsi.Dota2GameState.PostGame:
                    this.isInGame(false);
                    return false;
                case gsi.Dota2GameState.GameInProgress:
                    this.isInGame(true);
                    return true;
                default:
                    break;
            }
        }
        return false;
    }
}

const component = new GsiGameState();
broker.register("GSI/GAME_STATE", Topic.GSI_DATA_LIVE, Topic.DOTA_2_GAME_STATE, component.handleState.bind(component));
broker.register("GSI/GAME_STATE", Topic.GSI_DATA_OBSERVER, Topic.DOTA_2_GAME_STATE, component.handleState.bind(component));
