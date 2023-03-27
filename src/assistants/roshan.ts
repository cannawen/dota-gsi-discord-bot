import Event, { EventType } from "../gsi-data-classes/Event";
import { DeepReadonly } from "ts-essentials";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import Topic from "../engine/Topic";
import topic from "../topic";

const ROSHAN_MINIMUM_SPAWN_TIME = 8 * 60;
const ROSHAN_MAXIMUM_SPAWN_TIME = 11 * 60;

const roshanMaybeTimeTopic = new Topic<number>("roshanMaybeTimeTopic");
const roshanAliveTimeTopic = new Topic<number>("roshanAliveTimeTopic");

function roshanWasKilled(events: DeepReadonly<Event[]>) {
    return events.reduce(
        (memo, event) => event.type === EventType.RoshanKilled || memo,
        false
    );
}

export default [
    // When an event notifies us that roshan is killed
    // Set roshan maybe time to 8 minutes from now
    // Set roshan alibe time to 11 minutes from now
    new Rule(
        "assistant/roshan/killed_event/set_future_audio_state",
        [topic.time, topic.events],
        (get) => {
            if (roshanWasKilled(get(topic.events)!)) {
                const time = get(topic.time)!;
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
    ),

    // When the game time matches when roshan might be alive
    // Play audio and reset roshan maybe alive time state
    new Rule(
        "assistant/roshan/maybe_alive_time/play_audio",
        [topic.time, roshanMaybeTimeTopic],
        (get) => {
            if (get(topic.time) === get(roshanMaybeTimeTopic)) {
                return [
                    new Fact(topic.playAudioFile, "audio/rosh-maybe.mp3"),
                    new Fact(roshanMaybeTimeTopic, undefined),
                ];
            }
        }
    ),

    // When the game time matches when roshan should be alive
    // Play audio and reset roshan alive time state
    new Rule(
        "assistant/roshan/alive_time/play_audio",
        [topic.time, roshanAliveTimeTopic],
        (get) => {
            if (get(topic.time) === get(roshanAliveTimeTopic)) {
                return [
                    new Fact(topic.playAudioFile, "audio/rosh-alive.mp3"),
                    new Fact(roshanAliveTimeTopic, undefined),
                ];
            }
        }
    ),

    // When we are no longer in a game, reset all our roshan timers
    new Rule("assistant/roshan/reset", [topic.inGame], (get) => {
        if (!get(topic.inGame)) {
            return [
                new Fact(roshanAliveTimeTopic, undefined),
                new Fact(roshanMaybeTimeTopic, undefined),
            ];
        }
    }),
];
