import Event, { EventType } from "../gsi-data-classes/Event";
import configurable from "../engine/rules/configurable";
import { DeepReadonly } from "ts-essentials";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.roshan,
    EffectConfig.PUBLIC
);
export const assistantDescription =
    'Tracks roshan respawn time. Responds to discord voice command "What is rosh/roshan status/timer"';

const AEGIS_DURATION = 5 * 60;
const ROSHAN_MINIMUM_SPAWN_TIME = 8 * 60;
const ROSHAN_MAXIMUM_SPAWN_TIME = 11 * 60;

const roshanDeathTimesTopic = topicManager.createTopic<number[]>(
    "roshanDeathTimesTopic",
    {
        defaultValue: [],
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
    return (
        message.match(/^(what).{1,15}(status|timer?)$/i) !== null &&
        message.match(/torment/) === null
    );
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
                response = `Roshan is dead. Aegis expires at ${helper.secondsToTtsTimeString(
                    deathTime + AEGIS_DURATION
                )}`;
            } else if (time < deathTime + ROSHAN_MINIMUM_SPAWN_TIME) {
                response = `Roshan is dead. May respawn at ${helper.secondsToTtsTimeString(
                    deathTime + ROSHAN_MINIMUM_SPAWN_TIME
                )}`;
            } else if (time < deathTime + ROSHAN_MAXIMUM_SPAWN_TIME) {
                response = `Roshan may be alive. Guaranteed respawn at ${helper.secondsToTtsTimeString(
                    deathTime + ROSHAN_MAXIMUM_SPAWN_TIME
                )}`;
            }
        }
    }

    return response;
}

export default [
    new Rule({
        label: "when we get an event that says rosh is killed, add time to array",
        trigger: [topics.events],
        given: [topics.time, roshanDeathTimesTopic],
        when: ([events]) => roshanWasKilled(events),
        then: (_, [time, deathTimes]) =>
            new Fact(roshanDeathTimesTopic, [...deathTimes, time]),
    }),
    new Rule({
        label: "expose rosh death time to app",
        trigger: [roshanDeathTimesTopic],
        then: ([deathTimes]) =>
            new Fact(topics.roshanDeathTime, deathTimes.at(-1)),
    }),
    new Rule({
        label: "when time is 8 minutes after last roshan death, play reminder",
        trigger: [topics.time, roshanDeathTimesTopic],
        when: ([time, deathTimes]) => {
            const lastDeathTime = lastRoshDeathTime(deathTimes);
            if (lastDeathTime) {
                return time === lastDeathTime + ROSHAN_MINIMUM_SPAWN_TIME;
            } else {
                return false;
            }
        },
        then: () =>
            new Fact(
                topics.configurableEffect,
                "resources/audio/rosh-maybe.mp3"
            ),
    }),
    new Rule({
        label: "when time is 11 minutes after last roshan death, play reminder",
        trigger: [topics.time, roshanDeathTimesTopic],
        when: ([time, deathTimes]) => {
            const lastDeathTime = lastRoshDeathTime(deathTimes);
            if (lastDeathTime) {
                return time === lastDeathTime + ROSHAN_MAXIMUM_SPAWN_TIME;
            } else {
                return false;
            }
        },
        then: () =>
            new Fact(
                topics.configurableEffect,
                "resources/audio/rosh-alive.mp3"
            ),
    }),
    new Rule({
        label: "when asked what roshan status is, respond with status",
        trigger: [topics.lastDiscordUtterance],
        given: [roshanDeathTimesTopic, topics.time, topics.dayTime],
        when: ([utterance]) => isRoshStatusRequest(utterance),
        then: (_, [deathTimes, time, dayTime]) =>
            new Fact(
                topics.configurableEffect,
                roshStatusResponse(deathTimes, time, dayTime)
            ),
    }),
]
    .map(inGame)
    .map((rule) => configurable(configTopic, rule));
