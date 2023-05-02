import Event, { EventType } from "../gsi-data-classes/Event";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import helper from "./helpers/timeFormatting";
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

/**
 * Keeps an array of all the times that roshan has fallen
 */
const allRoshanDeathTimesTopic = topicManager.createTopic<number[]>(
    "allRoshanDeathTimesTopic",
    {
        defaultValue: [],
        persistAcrossRestarts: true,
    }
);

const lastRoshDeathTimeTopic = topicManager.createTopic<number>(
    "lastRoshDeathTimeTopic"
);

const aegisExpiryTimeTopic = topicManager.createTopic<number>(
    "aegisExpiryTimeTopic"
);

const roshanAliveMessageTopic = topicManager.createTopic<string>(
    "roshanAliveMessageTopic",
    { defaultValue: "Roshan has not been killed yet" }
);
const roshanStatusMessageTopic = topicManager.createTopic<string>(
    "roshanStatusMessageTopic"
);

function isRoshStatusRequest(message: string) {
    return (
        message.match(/^(what).{1,15}(status|timer?)$/i) !== null &&
        message.match(/torment/) === null
    );
}

/**
 * Sets roshanAliveMessageTopic based on how many times we ahave killed Roshan
 * Defaults to he has not been killed yet
 */
const aliveMessageRules = [
    new Rule({
        label: "killed once before",
        trigger: [allRoshanDeathTimesTopic],
        when: ([deathTimes]) => deathTimes.length === 1,
        then: () =>
            new Fact(
                roshanAliveMessageTopic,
                "Roshan is alive. Will drop aegis and cheese"
            ),
    }),
    new Rule({
        label: "killed twice or more, day time",
        trigger: [allRoshanDeathTimesTopic, topics.daytime],
        when: ([deathTimes, daytime]) => deathTimes.length > 1 && daytime,
        then: () =>
            new Fact(
                roshanAliveMessageTopic,
                "Roshan is alive. Will drop aegis, cheese, and aghanim's blessing"
            ),
    }),
    new Rule({
        label: "killed twice or more, night time",
        trigger: [allRoshanDeathTimesTopic, topics.daytime],
        when: ([deathTimes, daytime]) => deathTimes.length > 1 && !daytime,
        then: () =>
            new Fact(
                roshanAliveMessageTopic,
                "Roshan is alive. Will drop aegis, cheese, and refresher shard"
            ),
    }),
];

/**
 * Sets roshanStatusMessageTopic based on if rosh is dead or alive (
 */
const statusMessageRules = [
    ...aliveMessageRules,
    new Rule({
        label: "rosh is dead - aegis still up",
        trigger: [topics.time, aegisExpiryTimeTopic],
        when: ([time, aegisExpiryTime]) => time < aegisExpiryTime,
        then: ([_, aegisExpiryTime]) =>
            new Fact(
                roshanStatusMessageTopic,
                `Roshan is dead. Aegis expires at ${helper.secondsToTtsTimeString(
                    aegisExpiryTime
                )}`
            ),
    }),
    new Rule({
        label: "rosh is dead",
        trigger: [
            topics.time,
            aegisExpiryTimeTopic,
            topics.roshanMaybeAliveTimeTopic,
        ],
        when: ([time, aegisExpiryTime, maybeAliveTime]) =>
            time >= aegisExpiryTime && time < maybeAliveTime,
        then: ([_time, _aegis, maybeAliveTime]) =>
            new Fact(
                roshanStatusMessageTopic,
                `Roshan is dead. May respawn at ${helper.secondsToTtsTimeString(
                    maybeAliveTime
                )}`
            ),
    }),
    new Rule({
        label: "rosh may be alive",
        trigger: [
            topics.time,
            topics.roshanMaybeAliveTimeTopic,
            topics.roshanAliveTimeTopic,
        ],
        when: ([time, maybeAliveTime, aliveTime]) =>
            time >= maybeAliveTime && time < aliveTime,
        then: ([_time, _maybe, aliveTime]) =>
            new Fact(
                roshanStatusMessageTopic,
                `Roshan may be alive. Guaranteed respawn at ${helper.secondsToTtsTimeString(
                    aliveTime
                )}`
            ),
    }),
    new Rule({
        label: "roshan is alive - we have never killed him, or when we are 11 minutes after last death time",
        trigger: [topics.time],
        given: [
            lastRoshDeathTimeTopic,
            topics.roshanAliveTimeTopic,
            roshanAliveMessageTopic,
        ],
        when: ([time], [deathTime, aliveTime]) =>
            deathTime === undefined || time >= aliveTime,
        then: (_time, [_deathTime, _aliveTime, aliveMessage]) =>
            new Fact(roshanStatusMessageTopic, aliveMessage),
    }),
];

export default [
    ...statusMessageRules,
    new Rule({
        label: "when we get an event that says rosh is killed, add time to array",
        trigger: [topics.events],
        given: [topics.time, allRoshanDeathTimesTopic],
        when: ([events]) =>
            events.reduce(
                (memo: boolean, event: Event) =>
                    event.type === EventType.RoshanKilled || memo,
                false
            ),
        then: (_, [time, deathTimes]) =>
            new Fact(allRoshanDeathTimesTopic, [...deathTimes, time]),
    }),
    new Rule({
        label: "last roshan death time",
        trigger: [allRoshanDeathTimesTopic],
        then: ([deathTimes]) =>
            new Fact(lastRoshDeathTimeTopic, deathTimes.at(-1)),
    }),
    new Rule({
        label: "set aegis expiry time",
        trigger: [lastRoshDeathTimeTopic],
        then: ([deathTime]) =>
            new Fact(aegisExpiryTimeTopic, deathTime + AEGIS_DURATION),
    }),
    new Rule({
        label: "set time minimum rosh respawn",
        trigger: [lastRoshDeathTimeTopic],
        then: ([deathTime]) =>
            new Fact(
                topics.roshanMaybeAliveTimeTopic,
                deathTime + ROSHAN_MINIMUM_SPAWN_TIME
            ),
    }),
    new Rule({
        label: "set time minimum rosh respawn",
        trigger: [lastRoshDeathTimeTopic],
        then: ([deathTime]) =>
            new Fact(
                topics.roshanAliveTimeTopic,
                deathTime + ROSHAN_MAXIMUM_SPAWN_TIME
            ),
    }),

    new Rule({
        label: "when rosh may be up, play reminder",
        trigger: [topics.time, topics.roshanMaybeAliveTimeTopic],
        when: ([time, maybeAlivetime]) => time === maybeAlivetime,
        then: () =>
            new Fact(
                topics.configurableEffect,
                "resources/audio/rosh-maybe.mp3"
            ),
    }),
    new Rule({
        label: "when rosh is guaranteed to be up, play reminder",
        trigger: [topics.time, topics.roshanAliveTimeTopic],
        when: ([time, aliveTime]) => time === aliveTime,
        then: () =>
            new Fact(
                topics.configurableEffect,
                "resources/audio/rosh-alive.mp3"
            ),
    }),
    new Rule({
        label: "when asked what roshan status is, respond with status",
        trigger: [topics.lastDiscordUtterance],
        given: [roshanStatusMessageTopic],
        when: ([utterance]) => isRoshStatusRequest(utterance),
        then: (_, [message]) => new Fact(topics.configurableEffect, message),
    }),
]
    .map(inGame)
    .map((rule) => configurable(configTopic, rule));
