import Event, { EventType } from "../Event";
import { Fact, Topic } from "../Engine";
import engine from "../customEngine";
import topics from "../topics";

const ROSHAN_MINIMUM_SPAWN_TIME = 8 * 60;
const ROSHAN_MAXIMUM_SPAWN_TIME = 11 * 60;

const roshanMaybeTimeTopic = new Topic<number | undefined>(
    "roshanMaybeTimeTopic"
);
const roshanAliveTimeTopic = new Topic<number | undefined>(
    "roshanAliveTimeTopic"
);

function roshanWasKilled(events: Event[]) {
    return events.reduce(
        (memo, event) => event.type === EventType.RoshanKilled || memo,
        false
    );
}

// When an event notifies us that roshan is killed
// Set roshan maybe time to 8 minutes from now
// Set roshan alibe time to 11 minutes from now
engine.register(
    "assistant/roshan/killed_event/set_future_audio_state",
    [topics.time, topics.events],
    (get) => {
        if (roshanWasKilled(get(topics.events))) {
            const time = get(topics.time);
            return [
                new Fact(
                    roshanMaybeTimeTopic,
                    time + ROSHAN_MINIMUM_SPAWN_TIME
                ),
                new Fact(
                    roshanAliveTimeTopic,
                    time + ROSHAN_MAXIMUM_SPAWN_TIME
                ),
            ];
        }
    }
);

// When the game time matches when roshan might be alive
// Play audio and reset roshan maybe alive time state
engine.register(
    "assistant/roshan/maybe_alive_time/play_audio",
    [topics.time, roshanMaybeTimeTopic],
    (get) => {
        if (get(topics.time) === get(roshanMaybeTimeTopic)) {
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
        if (get(topics.time) === get(roshanAliveTimeTopic)) {
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
