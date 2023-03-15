import {
    IEventHandlerEvents,
    IEventHandlerGameState,
    IEventHandlerTime,
} from "../IEventHandlers";
import Constants from "./Constants";
import logic from "./logic";
import sideEffect from "../../SideEffect";

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
        return {
            data: null,
            type: sideEffect.Type.NONE,
        };
    }

    handleTime(time: number) {
        this.currentTime = time;
        const newRoshStatus = logic(time, this.lastRoshanDeathTime);
        if (newRoshStatus !== this.roshStatus) {
            this.roshStatus = newRoshStatus;
            console.log(" time " + time + " rosh state " + this.roshStatus + " last rosh death time " + this.lastRoshanDeathTime);

            switch (newRoshStatus) {
            case Constants.Status.ALIVE:
                return {
                    data: "roshan is up", // try mp3 file
                    type: sideEffect.Type.TTS,
                };
            case Constants.Status.UNKNOWN:
                return {
                    data: "roshan might be up", // try mp3 file
                    type: sideEffect.Type.TTS,
                };
            default:
                break;
            }
        }
        return {
            data: null,
            type: sideEffect.Type.NONE,
        };
    }

    handleEvent(eventType: string, time: number) {
        if (eventType === "roshan_killed") {
            this.lastRoshanDeathTime = time;
            this.roshStatus = Constants.Status.DEAD;
            return {
                data: "roshan died",
                type: sideEffect.Type.TTS,
            };
        }
        return {
            data: null,
            type: sideEffect.Type.NONE,
        };
    }
}
