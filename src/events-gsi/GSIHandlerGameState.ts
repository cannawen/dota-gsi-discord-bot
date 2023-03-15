import handler from "../events-app/eventHandlers";
import {
    IEventHandlerGameState,
} from "../events-app/IEventHandlers";
import sideEffect from "../SideEffect";

const interestedHandlers : IEventHandlerGameState[] = [
    handler.roshan,
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
                }) => sideEffect.create(type, data).execute());
        }
    }
}
