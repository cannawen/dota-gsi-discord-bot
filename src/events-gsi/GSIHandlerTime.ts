import handler from "../events-app/eventHandlers";

export default class GSIHandlerTime {
    time: number | undefined;

    currentTime(newTime: number) {
        // this method may be called multiple times with the same newTime value
        // we need debouncing so our side effects do not happen more than once
        if (this.time !== newTime) {
            this.time = newTime;
            handler.roshan.handleTime(newTime).execute();
            handler.runes.handleTime(newTime).execute();
            // handler.stack.handleTime(newTime).execute();
        }
    }
}
