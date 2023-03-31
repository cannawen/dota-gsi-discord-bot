import { Config, configToEffectTopic } from "../configTopics";
import Event, { EventType } from "../gsi-data-classes/Event";
import { DeepReadonly } from "ts-essentials";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import Topic from "../engine/Topic";
import topics from "../topics";

export const configTopic = new Topic<Config>("assistant/roshan");
export const defaultConfig = Config.PUBLIC;

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
        [configTopic, topics.gsi.time, topics.gsi.events],
        (get) => {
            const effect = configToEffectTopic[get(configTopic)!];
            if (!effect) return;

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
        [configTopic, topics.gsi.time, roshanMaybeTimeTopic],
        (get) => {
            const effect = configToEffectTopic[get(configTopic)!];
            if (!effect) return;

            if (get(topics.gsi.time)! >= get(roshanMaybeTimeTopic)!) {
                return [
                    new Fact(effect, "resources/audio/rosh-maybe.mp3"),
                    new Fact(roshanMaybeTimeTopic, undefined),
                ];
            }
        }
    ),

    // When the game time is past when roshan should be alive
    // Play audio and reset roshan alive time state
    new Rule(
        rules.assistant.roshan.aliveTime,
        [configTopic, topics.gsi.time, roshanAliveTimeTopic],
        (get) => {
            const effect = configToEffectTopic[get(configTopic)!];
            if (!effect) return;

            if (get(topics.gsi.time)! >= get(roshanAliveTimeTopic)!) {
                return [
                    new Fact(effect, "resources/audio/rosh-alive.mp3"),
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
