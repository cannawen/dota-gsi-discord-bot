import {
    IDota2ObserverState, IDota2State,
} from "node-gsi";
import effects from "../effectsRegistry";
import gsi = require("node-gsi");
import GsiSubject from "./GsiSubject";
import {
    IGsiGameStateObserver,
} from "../IGsiObservers";
import log from "../log";

export default class GsiGameStateSubject extends GsiSubject {
    protected observers : IGsiGameStateObserver[] = [];
    private inGame = false;

    private isInGame(newInGame: boolean) {
        if (this.inGame !== newInGame) {
            this.inGame = newInGame;

            this.observers
                .map((observers) => observers.inGame(newInGame))
                .map(effects.invoke);
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
