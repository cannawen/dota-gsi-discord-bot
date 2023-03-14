import handler from "../events-app/eventHandlers";

const allEvents = [
    handler.roshan,
    handler.runes,
    handler.stack,
];
const disabledEvents = [
    handler.roshan,
    handler.stack,
];

export default class GSIHandlerTime {
    time: number | undefined;

    currentTime(newTime: number) {
        // this method may be called multiple times with the same newTime value
        // we need debouncing so our side effects do not happen more than once
        if (this.time !== newTime) {
            this.time = newTime;

            allEvents
                .filter((event) => !disabledEvents.includes(event))
                .map((event) => event.handleTime(newTime).execute());
        }
    }
}
