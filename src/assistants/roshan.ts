import Event, { EventType } from "../gsi-data-classes/Event";
import { DeepReadonly } from "ts-essentials";
import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.roshan
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    'Tracks roshan respawn time. Responds to discord voice command "What is rosh/roshan status/timer"';

const AEGIS_DURATION = 5 * 60;
const ROSHAN_MINIMUM_SPAWN_TIME = 8 * 60;
const ROSHAN_MAXIMUM_SPAWN_TIME = 11 * 60;

const roshanDeathTimesTopic = topicManager.createTopic<number[]>(
    "roshanDeathTimesTopic",
    {
        persistAcrossRestarts: true,
    }
);

// TODO add test for alive message time
function aliveMessage(deathTimes: number[], dayTime: boolean | undefined) {
    const times = deathTimes.length;
    if (times === 0) {
        return "Roshan has not been killed yet";
    }
    if (times === 1) {
        return "Roshan is alive. Will drop aegis and cheese";
    }
    if (dayTime === undefined) {
        return "Roshan is alive. Will drop aegis, cheese, and aghanim's blessing or refresher shard";
    }
    if (dayTime) {
        return "Roshan is alive. Will drop aegis, cheese, and aghanim's blessing";
    } else {
        return "Roshan is alive. Will drop aegis, cheese, and refresher shard";
    }
}

function lastRoshDeathTime(deathTimes: number[]) {
    return deathTimes.at(-1);
}

function roshanWasKilled(events: DeepReadonly<Event[]>) {
    return events.reduce(
        (memo, event) => event.type === EventType.RoshanKilled || memo,
        false
    );
}

function isRoshStatusRequest(message: string) {
    return message.match(/^(what).{1,15}(status|timer?)$/i) !== null;
}

function roshStatusResponse(
    deathTimes: number[] | undefined,
    time: number | undefined,
    dayTime: boolean | undefined
) {
    let response = "Rosh status is unknown";
    if (deathTimes !== undefined && time !== undefined) {
        const deathTime = lastRoshDeathTime(deathTimes);
        response = aliveMessage(deathTimes, dayTime);

        if (deathTime) {
            if (time < deathTime + AEGIS_DURATION) {
                response = `Roshan is dead. Aegis expires at ${
                    (helper.secondsToTimeString(deathTime + AEGIS_DURATION),
                    true)
                }`;
            } else if (time < deathTime + ROSHAN_MINIMUM_SPAWN_TIME) {
                response = `Roshan is dead. May respawn at ${
                    (helper.secondsToTimeString(
                        deathTime + ROSHAN_MINIMUM_SPAWN_TIME
                    ),
                    true)
                }`;
            } else if (time < deathTime + ROSHAN_MAXIMUM_SPAWN_TIME) {
                response = `Roshan may be alive. Guaranteed respawn at ${
                    (helper.secondsToTimeString(
                        deathTime + ROSHAN_MAXIMUM_SPAWN_TIME
                    ),
                    true)
                }`;
            }
        }
    }

    return response;
}

export default [
    new Rule(
        "when we get an event that says rosh is killed, add time to array",
        [topics.time, topics.events],
        () => {},
        ([_, events]) => roshanWasKilled(events),
        ([time, _], get) =>
            new Fact(roshanDeathTimesTopic, [
                ...get(roshanDeathTimesTopic)!,
                time,
            ]),
        [[roshanDeathTimesTopic, []]]
    ),
    new Rule(
        "when time is 8 minutes after last roshan death, play reminder",
        [topics.time, roshanDeathTimesTopic],
        () => {},
        ([time, deathTimes]) => {
            const lastDeathTime = lastRoshDeathTime(deathTimes);
            if (lastDeathTime) {
                return time === lastDeathTime + ROSHAN_MINIMUM_SPAWN_TIME;
            } else {
                return false;
            }
        },
        () =>
            new Fact(
                topics.configurableEffect,
                "resources/audio/rosh-maybe.mp3"
            )
    ),
    new Rule(
        "when time is 11 minutes after last roshan death, play reminder",
        [topics.time, roshanDeathTimesTopic],
        () => {},
        ([time, deathTimes]) => {
            const lastDeathTime = lastRoshDeathTime(deathTimes);
            if (lastDeathTime) {
                return time === lastDeathTime + ROSHAN_MAXIMUM_SPAWN_TIME;
            } else {
                return false;
            }
        },
        () =>
            new Fact(
                topics.configurableEffect,
                "resources/audio/rosh-alive.mp3"
            )
    ),
    new Rule(
        "when asked what roshan status is, respond with status",
        [topics.lastDiscordUtterance],
        () => {},
        ([utterance]) => isRoshStatusRequest(utterance),
        (_, get) =>
            new Fact(
                topics.configurableEffect,
                roshStatusResponse(
                    get(roshanDeathTimesTopic),
                    get(topics.time),
                    get(topics.dayTime)
                )
            )
    ),
].map(
    (rule) =>
        new RuleDecoratorConfigurable(
            configTopic,
            new RuleDecoratorInGame(rule)
        )
);
