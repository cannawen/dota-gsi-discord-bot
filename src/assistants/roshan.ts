import { Fact, Topic } from "../Engine";
import engine from "../customEngine";
import { EventType } from "../Event";
import topics from "../topics";

const roshanMaybeTimeTopic = new Topic<number>("roshanMaybeTimeTopic");
const roshanAliveTimeTopic = new Topic<number>("roshanAliveTimeTopic");

// When we are notified that roshan is killed
// Set roshan maybe time to 8 minutes from now
// Set roshan alibe time to 11 minutes from now
engine.register(
    "assistant/roshan/killed_event/set_future_audio_state",
    [topics.time, topics.events],
    (get) => {
        const roshKilledEventIndex = get(topics.events)
            ?.map((event) => event.type)
            .indexOf(EventType.RoshanKilled);
        if (roshKilledEventIndex !== undefined && roshKilledEventIndex !== -1) {
            const time = get(topics.time);
            if (time) {
                return [
                    new Fact(roshanMaybeTimeTopic, time + 8 * 60),
                    new Fact(roshanAliveTimeTopic, time + 11 * 60),
                ];
            }
        }
    }
);

// When the game time matches when roshan might be alive
// Play audio and reset roshan maybe alive time state
engine.register(
    "assistant/roshan/maybe_alive_time/play_audio",
    [topics.time, roshanMaybeTimeTopic],
    (get) => {
        if (
            get(topics.time) !== undefined &&
            get(topics.time) === get(roshanMaybeTimeTopic)
        ) {
            return [
                new Fact(topics.playAudioFile, "rosh-maybe.mp3"),
                new Fact(roshanMaybeTimeTopic, undefined),
            ];
        }
    }
);

// When the game time matches when roshan should be alive
// Play audio and reset roshan alive time state
engine.register(
    "assistant/roshan/alive_time/play_audio",
    [topics.time, roshanAliveTimeTopic],
    (get) => {
        if (
            get(topics.time) !== undefined &&
            get(topics.time) === get(roshanAliveTimeTopic)
        ) {
            return [
                new Fact(topics.playAudioFile, "rosh-alive.mp3"),
                new Fact(roshanAliveTimeTopic, undefined),
            ];
        }
    }
);

// When we are no longer in a game, reset all our roshan timers
engine.register("assistant/roshan/reset", [topics.inGame], (get) => {
    if (!get(topics.inGame)) {
        return [
            new Fact(roshanAliveTimeTopic, undefined),
            new Fact(roshanMaybeTimeTopic, undefined),
        ];
    }
});
