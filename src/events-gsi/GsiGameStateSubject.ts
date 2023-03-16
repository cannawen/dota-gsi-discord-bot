import {
    IDota2ObserverState, IDota2State,
} from "node-gsi";
import gsi = require("node-gsi");
import GsiSubject from "./GsiSubject";
import {
    IGsiGameStateObserver,
} from "../events-app/IGsiObservers";
import {
    gsiLog as log,
} from "../log";
import SideEffect from "../SideEffect";

export default class GsiGameStateSubject extends GsiSubject {
    protected subscribers : IGsiGameStateObserver[] = [];
    private inGame = false;

    private isInGame(newInGame: boolean) {
        if (this.inGame !== newInGame) {
            this.inGame = newInGame;

            this.subscribers
                .map((event) => event.inGame(newInGame))
                .map(({
                    data,
                    type,
                }) => SideEffect.create(type, data).execute());
        }
    }

    public handleState(state: IDota2State | IDota2ObserverState): void {
        if (state.map?.gameState) {
            log.debug("map.gameState %s", state.map.gameState);
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
