import GsiHander from "./GsiHandler";
import {
    IGsiGameStateSubscriber,
} from "../events-app/IGsiSubscribers";
import SideEffect from "../SideEffect";

export default class GsiGameStateHandler extends GsiHander {
    protected subscribers : IGsiGameStateSubscriber[] = [];
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
