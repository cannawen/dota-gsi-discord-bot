import Event, { EventType } from "../gsi-data-classes/Event";
import { DeepReadonly } from "ts-essentials";
import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic("roshan");
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    'Tracks roshan respawn time. Responds to discord voice command "What is (rosh/roshan) status"';

const ROSHAN_MINIMUM_SPAWN_TIME = 8 * 60;
const ROSHAN_MAXIMUM_SPAWN_TIME = 11 * 60;

const roshanMaybeTimeTopic = topicManager.createTopic<number>(
    "roshanMaybeTimeTopic",
    {
        persistAcrossRestarts: true,
    }
);
const roshanAliveTimeTopic = topicManager.createTopic<number>(
    "roshanAliveTimeTopic",
    {
        persistAcrossRestarts: true,
    }
);

function roshanWasKilled(events: DeepReadonly<Event[]>) {
    return events.reduce(
        (memo, event) => event.type === EventType.RoshanKilled || memo,
        false
    );
}

function roshStatusMessage(message: string) {
    return message.match(/what is.*status/i) !== null;
}

function secondsToTimeString(seconds: number) {
    const totalMs = seconds * 1000;
    const result = new Date(totalMs).toISOString().slice(14, 19);

    return result.replace(":", " ");
}

export default [
    // When an event notifies us that roshan is killed
    // Set roshan maybe time to 8 minutes from now
    // Set roshan alibe time to 11 minutes from now
    new Rule(
        rules.assistant.roshan.killedEvent,
        [topics.time, topics.events],
        (get) => {
            if (roshanWasKilled(get(topics.events)!)) {
                const time = get(topics.time)!;
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
    new RuleConfigurable(
        rules.assistant.roshan.maybeAliveTime,
        configTopic,
        [topics.time, roshanMaybeTimeTopic],
        (get, effect) => {
            if (get(topics.time)! >= get(roshanMaybeTimeTopic)!) {
                return [
                    new Fact(effect, "resources/audio/rosh-maybe.mp3"),
                    new Fact(roshanMaybeTimeTopic, undefined),
                ];
            }
        }
    ),

    // When the game time is past when roshan should be alive
    // Play audio and reset roshan alive time state
    new RuleConfigurable(
        rules.assistant.roshan.aliveTime,
        configTopic,
        [topics.time, roshanAliveTimeTopic],
        (get, effect) => {
            if (get(topics.time)! >= get(roshanAliveTimeTopic)!) {
                return [
                    new Fact(effect, "resources/audio/rosh-alive.mp3"),
                    new Fact(roshanAliveTimeTopic, undefined),
                ];
            }
        }
    ),

    new RuleConfigurable(
        rules.assistant.roshan.voice,
        configTopic,
        [topics.lastDiscordMessage],
        (get, effect) => {
            const message = get(topics.lastDiscordMessage)!;
            if (!roshStatusMessage(message)) {
                return;
            }
            const maybeAlive = get(roshanMaybeTimeTopic);
            if (maybeAlive) {
                return new Fact(
                    effect,
                    `Roshan is dead. May respawn at ${secondsToTimeString(
                        maybeAlive
                    )}`
                );
            }
            const alive = get(roshanAliveTimeTopic);
            if (alive) {
                return new Fact(
                    effect,
                    `Roshan may be alive. Guaranteed respawn at ${secondsToTimeString(
                        alive
                    )}`
                );
            }
            if (get(topics.inGame)) {
                return new Fact(effect, "Roshan is alive");
            } else {
                return new Fact(effect, "You are not in a game");
            }
        }
    ),
];
