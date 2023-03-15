import appHandler from "../events-app/allAppHandlers";
import gsiHandler from "./allGsiEvents";
import {
    IGsiGameStateConsumer,
} from "../events-app/IGsiConsumers";
import SideEffect from "../SideEffect";

const interestedHandlers : IGsiGameStateConsumer[] = [
    // gsiHandler.event,
    appHandler.roshan,
];

export default class GsiGameStateHandler {
    inGame = false;

    isInGame(newInGame: boolean) {
        if (this.inGame !== newInGame) {
            this.inGame = newInGame;

            interestedHandlers
                .map((event) => event.inGame(newInGame))
                .map(({
                    data,
                    type,
                }) => SideEffect.create(type, data).execute());
        }
    }
}
