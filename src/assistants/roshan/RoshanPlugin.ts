import Constants from "./Constants";
import broker from "../../broker";
import gsi from "node-gsi";
import logic from "./logic";
import Topic from "../../Topic";

export default class RoshanPlugin {
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

    public handleTime(time: number) : string | void {
        this.currentTime = time;
        const newRoshStatus = logic(time, this.lastRoshanDeathTime);
        if (newRoshStatus !== this.roshStatus) {
            this.roshStatus = newRoshStatus;
            switch (newRoshStatus) {
                case Constants.Status.ALIVE:
                    return "rosh-alive.mp3";
                case Constants.Status.UNKNOWN:
                    return "rosh-maybe.mp3";
                default:
                    break;
            }
        }
    }

    private handleEvent(eventType: string, _time: number) : void {
        // `time` we get from the event is incorrect - use current time instead
        if (eventType === "roshan_killed") {
            this.lastRoshanDeathTime = this.currentTime;
            this.roshStatus = Constants.Status.DEAD;
        }
    }

    public handleEvents(events: gsi.IEvent[]) : void {
        events.map((gsiEvent) => {
            this.handleEvent(gsiEvent.eventType, gsiEvent.gameTime);
        });
    }
}

const component = new RoshanPlugin();
broker.register(Topic.DOTA_2_TIME, Topic.EFFECT_PLAY_FILE, component.handleTime.bind(component));
broker.register(Topic.DOTA_2_GAME_STATE, null, component.inGame.bind(component));
broker.register(Topic.DOTA_2_EVENTS, null, component.handleEvents.bind(component));
