import {
    IEventHandlerEvents,
    IEventHandlerGameState,
    IEventHandlerTime,
} from "../IEventHandlers";
import {
    SideEffectAudio,
    SideEffectNone,
    SideEffectTTS,
} from "../../SideEffect";
import Constants from "./Constants";
import logic from "./logic";

export default class AppHandlerRoshan implements IEventHandlerTime, IEventHandlerGameState, IEventHandlerEvents {
    currentTime: number | undefined;
    lastRoshanDeathTime: number | undefined;
    roshStatus: string;

    constructor() {
        this.roshStatus = Constants.Status.ALIVE;
    }

    inGame(inGame: boolean) {
        if (!inGame) {
            this.currentTime = undefined;
            this.lastRoshanDeathTime = undefined;
            this.roshStatus = Constants.Status.ALIVE;
        }
    }

    handleTime(time: number) {
        this.currentTime = time;
        console.log(" time " + time + " rosh state " + this.roshStatus + "last rosh death time" + this.lastRoshanDeathTime);
        const newRoshStatus = logic(time, this.lastRoshanDeathTime);
        if (newRoshStatus !== this.roshStatus) {
            this.roshStatus = newRoshStatus;
            console.log("ROSH STATE CHANGED " + newRoshStatus);

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
            return new SideEffectTTS("roshan died");
        }
        return new SideEffectNone();
    }
}
