import { Topic, Fact } from "../Engine";
import engine from "../CustomEngine";
import topics from "../topics";

const roshanMaybeAliveTime = new Topic<number>("roshanMaybeAliveTime");
const roshanAliveTime = new Topic<number>("roshanAliveTime");

engine.register(
    "assistant/roshan/killed_event/set_future_audio_state",
    [topics.time, topics.events],
    (get) => {
        const roshKilledEventIndex = get(topics.events)
            ?.map((event) => event.type)
            .indexOf("roshan_killed");
        if (roshKilledEventIndex !== undefined && roshKilledEventIndex !== -1) {
            const time = get(topics.time);
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
    [topics.time, roshanMaybeAliveTime],
    (get) => {
        if (get(topics.time) === get(roshanMaybeAliveTime)) {
            return [
                new Fact(topics.playAudioFile, "rosh-maybe.mp3"),
                new Fact(roshanMaybeAliveTime, undefined),
            ];
        }
    }
);

engine.register(
    "assistant/roshan/alive_time/play_audio",
    [topics.time, roshanAliveTime],
    (get) => {
        if (get(topics.time) === get(roshanAliveTime)) {
            return [
                new Fact(topics.playAudioFile, "rosh-alive.mp3"),
                new Fact(roshanAliveTime, undefined),
            ];
        }
    }
);
