import Constants from "./Constants";
import EffectInfo from "../../EffectInfo";
import GsiEventsObserver from "../../gsi/GsiEventsObserver";
import GsiGameStateObserver from "../../gsi/GsiGameStateObserver";
import GsiTimeObserver from "../../gsi/GsiTimeObserver";
import logic from "./logic";

export default class RoshanPlugin
implements GsiTimeObserver, GsiGameStateObserver, GsiEventsObserver {
    private currentTime: number | undefined;
    private lastRoshanDeathTime: number | undefined;
    private roshStatus: string | undefined;

    private resetState() {
        this.currentTime = undefined;
        this.lastRoshanDeathTime = undefined;
        this.roshStatus = Constants.Status.ALIVE;
    }

    public constructor() {
        this.resetState();
    }

    public inGame(inGame: boolean) : void {
        if (!inGame) {
            this.resetState();
        }
    }

    public handleTime(time: number) : EffectInfo | void {
        this.currentTime = time;
        const newRoshStatus = logic(time, this.lastRoshanDeathTime);
        if (newRoshStatus !== this.roshStatus) {
            this.roshStatus = newRoshStatus;
            switch (newRoshStatus) {
                case Constants.Status.ALIVE:
                    return EffectInfo.createAudioFile("rosh-alive.mp3");
                case Constants.Status.UNKNOWN:
                    return EffectInfo.createAudioFile("rosh-maybe.mp3");
                default:
                    break;
            }
        }
    }

    public handleEvent(eventType: string, _time: number) : void {
        // `time` we get from the event is incorrect - use current time instead
        if (eventType === "roshan_killed") {
            this.lastRoshanDeathTime = this.currentTime;
            this.roshStatus = Constants.Status.DEAD;
        }
    }
}
