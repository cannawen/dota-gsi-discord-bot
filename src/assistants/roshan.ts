import { Topic, Fact } from "../Engine";
import engine from "../CustomEngine";
import topic from "../topics";

const roshanMaybeAliveTime = new Topic<number>("roshanMaybeAliveTime");
const roshanAliveTime = new Topic<number>("roshanAliveTime");

engine.register(
    "assistant/roshan/killed_event/set_future_audio_state",
    [topic.time, topic.events],
    (get) => {
        const roshKilledEventIndex = get(topic.events)
            ?.map((event) => event.type)
            .indexOf("roshan_killed");
        if (roshKilledEventIndex !== undefined && roshKilledEventIndex !== -1) {
            const time = get(topic.time);
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
    (get) => {
        if (get(topic.time) === get(roshanMaybeAliveTime)) {
            return [
                new Fact(topic.playAudioFile, "rosh-maybe.mp3"),
                new Fact(roshanMaybeAliveTime, undefined),
            ];
        }
    }
);

engine.register(
    "assistant/roshan/alive_time/play_audio",
    [topic.time, roshanAliveTime],
    (get) => {
        if (get(topic.time) === get(roshanAliveTime)) {
            return [
                new Fact(topic.playAudioFile, "rosh-alive.mp3"),
                new Fact(roshanAliveTime, undefined),
            ];
        }
    }
);
