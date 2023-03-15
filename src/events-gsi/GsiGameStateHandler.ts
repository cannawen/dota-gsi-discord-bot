import GsiHander from "./GsiHandler";
import {
    IGsiGameStateSubscriber,
} from "../events-app/IGsiConsumers";
import SideEffect from "../SideEffect";

export default class GsiGameStateHandler extends GsiHander {
    subscribers : IGsiGameStateSubscriber[] = [];
    inGame = false;

    isInGame(newInGame: boolean) {
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
