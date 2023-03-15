import handler from "../events-app/eventHandlers";
import {
    IEventHandlerTime,
} from "../events-app/IEventHandlers";
import sideEffect from "../SideEffect";

const interestedHandlers: IEventHandlerTime[] = [
    handler.roshan,
    handler.runes,
    // handler.stack,
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
                }) => sideEffect.create(type, data).execute());
        }
    }
}
