import Constants from "./Constants";
import Event from "../../Event";
import logic from "./logic";
import topic from "../../topics";
import { engine, Topic, Fact } from "../../Engine";

/*
export default class Roshan {
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

    public inGame(inGame: boolean): void {
        if (!inGame) {
            this.resetState();
        }
    }

    public handleTime(time: number): string | void {
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

    private handleEvent(eventType: string, _time: number): void {
        // `time` we get from the event is incorrect - use current time instead
        if (eventType === "roshan_killed") {
            this.lastRoshanDeathTime = this.currentTime;
            this.roshStatus = Constants.Status.DEAD;
        }
    }

    public handleEvents(events: Event[]): void {
        events.map((event) => {
            this.handleEvent(event.type, event.time);
        });
    }
}

const component = new Roshan();
*/
const localTopic = {
    roshanMaybeAliveTime: new Topic<number>("roshanMaybeAliveTime"),
    roshanAliveTime: new Topic<number>("roshanAliveTime"),
};

engine.register({
    label: "assistant/roshan/killed_event/set_future_audio_state",
    given: [topic.time, topic.events],
    when: (db) => {
        const index = db
            .get(topic.events)
            ?.map((event) => event.type)
            .indexOf("roshan_killed");
        return index !== undefined && index !== -1;
    },
    then: (db) => {
        const time = db.get(topic.time);
        if (time) {
            return [
                new Fact(localTopic.roshanMaybeAliveTime, time + 8 * 60),
                new Fact(localTopic.roshanAliveTime, time + 11 * 60),
            ];
        }
    },
});

engine.register({
    label: "assistant/roshan/maybe_alive_time/play_audio",
    given: [topic.time, localTopic.roshanMaybeAliveTime],
    when: (db) =>
        db.get(topic.time) === db.get(localTopic.roshanMaybeAliveTime),
    then: (_) => [new Fact(topic.playAudioFile, "rosh-maybe.mp3")],
});

engine.register({
    label: "assistant/roshan/alive_time/play_audio",
    given: [topic.time, localTopic.roshanAliveTime],
    when: (db) => db.get(topic.time) === db.get(localTopic.roshanAliveTime),
    then: (_) => [new Fact(topic.playAudioFile, "rosh-alive.mp3")],
});

const playAudio = (f: string) => console.log("PLAY", f);

engine.register({
    label: "playAudio",
    given: [topic.playAudioFile],
    then: (db) => {
        const f = db.get(topic.playAudioFile);
        if (f) {
            playAudio(f);
            //TODO need to reset audio to null so we can play the same audio twice in a row
        }
    },
});
