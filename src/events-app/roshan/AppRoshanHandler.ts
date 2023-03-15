import {
    IGsiEventsSubscriber,
    IGsiGameStateSubscriber,
    IGsiTimeSubscriber,
} from "../IGsiSubscribers";
import AppHandler from "../AppHandler";
import Constants from "./Constants";
import logic from "./logic";
import sideEffect from "../../SideEffect";

export default class AppRoshanHandler extends AppHandler
    implements IGsiTimeSubscriber, IGsiGameStateSubscriber, IGsiEventsSubscriber {
    private lastRoshanDeathTime: number | undefined;
    private roshStatus: string | undefined;

    private resetState() {
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
        const newRoshStatus = logic(time, this.lastRoshanDeathTime);
        if (newRoshStatus !== this.roshStatus) {
            this.roshStatus = newRoshStatus;
            switch (newRoshStatus) {
            case Constants.Status.ALIVE:
                return {
                    // try mp3 file
                    data: "roshan is up",
                    type: sideEffect.Type.TTS,
                };
            case Constants.Status.UNKNOWN:
                return {
                    // try mp3 file
                    data: "roshan might be up",
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

    public handleEvent(eventType: string, time: number) {
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
