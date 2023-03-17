import {
    IDota2ObserverState, IDota2State,
} from "node-gsi";
import gsi = require("node-gsi");
import GsiSubject from "./GsiSubject";
import {
    IGsiGameStateObserver,
} from "../IGsiObservers";
import log from "../log";
import SideEffect from "../SideEffect";

export default class GsiGameStateSubject extends GsiSubject {
    protected observers : IGsiGameStateObserver[] = [];
    private inGame = false;

    private isInGame(newInGame: boolean) {
        if (this.inGame !== newInGame) {
            this.inGame = newInGame;

            this.observers
                .map((observers) => observers.inGame(newInGame)) // notify all observers if we are in a game
                .map((info) => SideEffect.create(info)) // create a side effect from the side effect info
                .map((sideEffect) => sideEffect.execute()); // execute that side effect - this doesn't belong here
        }
    }

    public handleState(state: IDota2State | IDota2ObserverState): void {
        if (state.map?.gameState) {
            log.gsiGameState.debug("map.gameState %s", state.map.gameState);
            switch (state.map?.gameState) {
                case gsi.Dota2GameState.PreGame:
                case gsi.Dota2GameState.TeamShowcase:
                case gsi.Dota2GameState.PostGame:
                    this.isInGame(false);
                    break;
                case gsi.Dota2GameState.GameInProgress:
                    this.isInGame(true);
                    break;
                default:
                    break;
            }
        }
    }
}
