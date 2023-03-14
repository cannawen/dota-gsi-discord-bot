import {
    IEventHandlerEvents, IEventHandlerGamePhase, IEventHandlerTime,
} from "../BaseEvent";
import {
    SideEffectAudio,
    SideEffectNone,
} from "../SideEffect";
import Constants from "./Constants";
import logic from "./logic";

export default class TimeHandlerRoshan implements IEventHandlerTime, IEventHandlerGamePhase, IEventHandlerEvents {
    currentTime: number | undefined;
    lastRoshanDeathTime: number | undefined;
    roshStatus: string;

    constructor() {
        this.roshStatus = Constants.Status.ALIVE;
    }

    resetState() {
        this.currentTime = undefined;
        this.lastRoshanDeathTime = undefined;
        this.roshStatus = Constants.Status.ALIVE;
    }

    handleTime(time: number) {
        this.currentTime = time;
        const newRoshStatus = logic(time, this.lastRoshanDeathTime);
        if (newRoshStatus !== this.roshStatus) {
            this.roshStatus = newRoshStatus;
            switch (newRoshStatus) {
            case Constants.Status.ALIVE:
                return new SideEffectAudio("rosh-alive.mp3");
            case Constants.Status.UNKNOWN:
                return new SideEffectAudio("rosh-maybe.mp3");
            default:
                break;
            }
        }
        return new SideEffectNone();
    }

    handleEvents(eventType: string, time: number) {
        if (eventType === "roshan_killed") {
            this.lastRoshanDeathTime = time;
        }
        return new SideEffectNone();
    }
}
