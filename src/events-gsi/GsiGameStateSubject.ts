import GsiSubject from "./GsiSubject";
import {
    IGsiGameStateObserver,
} from "../events-app/IGsiObservers";
import SideEffect from "../SideEffect";

export default class GsiGameStateSubject extends GsiSubject {
    protected subscribers : IGsiGameStateObserver[] = [];
    private inGame = false;

    public isInGame(newInGame: boolean) {
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
}
