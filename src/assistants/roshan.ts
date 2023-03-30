import Event, { EventType } from "../gsi-data-classes/Event";
import { DeepReadonly } from "ts-essentials";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import Topic from "../engine/Topic";
import topics from "../topics";

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
        rules.assistant.roshan.killedEvent,
        [topics.gsi.time, topics.gsi.events],
        (get) => {
            if (roshanWasKilled(get(topics.gsi.events)!)) {
                const time = get(topics.gsi.time)!;
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

    // When the game time is past when roshan might be alive
    // Play audio and reset roshan maybe alive time state
    new Rule(
        rules.assistant.roshan.maybeAliveTime,
        [topics.gsi.time, roshanMaybeTimeTopic],
        (get) => {
            if (get(topics.gsi.time)! >= get(roshanMaybeTimeTopic)!) {
                return [
                    new Fact(
                        topics.effect.playAudioFile,
                        "resources/audio/rosh-maybe.mp3"
                    ),
                    new Fact(roshanMaybeTimeTopic, undefined),
                ];
            }
        }
    ),

    // When the game time is past when roshan should be alive
    // Play audio and reset roshan alive time state
    new Rule(
        rules.assistant.roshan.aliveTime,
        [topics.gsi.time, roshanAliveTimeTopic],
        (get) => {
            if (get(topics.gsi.time)! >= get(roshanAliveTimeTopic)!) {
                return [
                    new Fact(
                        topics.effect.playAudioFile,
                        "resources/audio/rosh-alive.mp3"
                    ),
                    new Fact(roshanAliveTimeTopic, undefined),
                ];
            }
        }
    ),

    // When we are no longer in a game, reset all our roshan timers
    new Rule(rules.assistant.roshan.reset, [topics.gsi.inGame], (get) => {
        if (!get(topics.gsi.inGame)) {
            return [
                new Fact(roshanAliveTimeTopic, undefined),
                new Fact(roshanMaybeTimeTopic, undefined),
            ];
        }
    }),
];
