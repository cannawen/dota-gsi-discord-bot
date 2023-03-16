import {
    IGsiEventsObserver,
    IGsiGameStateObserver,
    IGsiTimeObserver,
} from "../../IGsiObservers";
import AppLogic from "../AppLogic";
import Constants from "./Constants";
import logic from "./logic";
import sideEffect from "../../SideEffect";

export default class AppRoshanLogic extends AppLogic
    implements IGsiTimeObserver, IGsiGameStateObserver, IGsiEventsObserver {
    private currentTime: number | undefined;
    private lastRoshanDeathTime: number | undefined;
    private roshStatus: string | undefined;

    private resetState() {
        this.currentTime = undefined;
        this.lastRoshanDeathTime = undefined;
        this.roshStatus = Constants.Status.ALIVE;
    }

    public constructor() {
        super();
        this.resetState();
    }

    public inGame(inGame: boolean) {
        if (!inGame) {
            this.resetState();
        }
        return {
            data: null,
            type: sideEffect.Type.NONE,
        };
    }

    public handleTime(time: number) {
        this.currentTime = time;
        const newRoshStatus = logic(time, this.lastRoshanDeathTime);
        if (newRoshStatus !== this.roshStatus) {
            this.roshStatus = newRoshStatus;
            switch (newRoshStatus) {
                case Constants.Status.ALIVE:
                    return {
                        data: "rosh-alive.mp3",
                        type: sideEffect.Type.AUDIO_FILE,
                    };
                case Constants.Status.UNKNOWN:
                    return {
                        data: "rosh-maybe.mp3",
                        type: sideEffect.Type.AUDIO_FILE,
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

    public handleEvent(eventType: string, _time: number) {
        // `time` we get from the event is incorrect - use current time instead
        if (eventType === "roshan_killed") {
            this.lastRoshanDeathTime = this.currentTime;
            this.roshStatus = Constants.Status.DEAD;
        }
        return {
            data: null,
            type: sideEffect.Type.NONE,
        };
    }
}
