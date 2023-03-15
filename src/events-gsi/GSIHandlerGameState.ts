import appHandler from "../events-app/eventHandlers";
import gsiHandler from "./eventHandlers";
import {
    IEventHandlerGameState,
} from "../events-app/IEventHandlers";
import SideEffect from "../SideEffect";

const interestedHandlers : IEventHandlerGameState[] = [
    // gsiHandler.event,
    appHandler.roshan,
];

export default class GSIHandlerGameState {
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
