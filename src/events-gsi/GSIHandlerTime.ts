import handler from "../events-app/eventHandlers";
import sideEffect from "../SideEffect";

const enabledEvents = [
    handler.roshan,
    handler.runes,
    // handler.stack,
];

export default class GSIHandlerTime {
    time: number | undefined;

    currentTime(newTime: number) {
        // this method may be called multiple times with the same newTime value
        // we need debouncing so our side effects do not happen more than once
        if (this.time !== newTime) {
            this.time = newTime;
            enabledEvents.map((e) => {
                const effect = e.handleTime(newTime);
                sideEffect.create(effect.type, effect.data).execute();
            });
        }
    }
}
