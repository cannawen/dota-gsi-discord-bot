import appHandler from "../events-app/eventHandlers";
import {
    IEventHandlerTime,
} from "../events-app/IEventHandlers";
import SideEffect from "../SideEffect";

const interestedHandlers: IEventHandlerTime[] = [
    appHandler.roshan,
    appHandler.runes,
    // appHandler.stack,
];

export default class GSIHandlerTime {
    time: number | undefined;

    currentTime(newTime: number) {
        if (this.time !== newTime) {
            this.time = newTime;

            interestedHandlers
                .map((handler) => handler.handleTime(newTime))
                .map(({
                    data,
                    type,
                }) => SideEffect.create(type, data).execute());
        }
    }
}
