import topic from "../topics";
import { engine, Topic, Fact } from "../Engine";

const roshanMaybeAliveTime = new Topic<number>("roshanMaybeAliveTime");
const roshanAliveTime = new Topic<number>("roshanAliveTime");

engine.register(
    "assistant/roshan/killed_event/set_future_audio_state",
    [topic.time, topic.events],
    (db) => {
        const roshKilledEventIndex = db
            .get(topic.events)
            ?.map((event) => event.type)
            .indexOf("roshan_killed");
        if (roshKilledEventIndex !== undefined && roshKilledEventIndex !== -1) {
            const time = db.get(topic.time);
            if (time) {
                return [
                    new Fact(roshanMaybeAliveTime, time + 8 * 60),
                    new Fact(roshanAliveTime, time + 11 * 60),
                ];
            }
        }
    }
);

engine.register(
    "assistant/roshan/maybe_alive_time/play_audio",
    [topic.time, roshanMaybeAliveTime],
    (db) => {
        if (db.get(topic.time) === db.get(roshanMaybeAliveTime)) {
            return [new Fact(topic.playAudioFile, "rosh-maybe.mp3")];
        }
    }
);

engine.register(
    "assistant/roshan/alive_time/play_audio",
    [topic.time, roshanAliveTime],
    (db) => {
        if (db.get(topic.time) === db.get(roshanAliveTime)) {
            return [new Fact(topic.playAudioFile, "rosh-alive.mp3")];
        }
    }
);
