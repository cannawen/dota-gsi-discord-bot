import roshHelper, { Status } from "./helpers/roshan";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import { EventType } from "../gsi-data-classes/Event";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import timeHelper from "./helpers/time";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.roshan,
    "Roshan timer",
    'Tracks roshan respawn time. Responds to voice command "What is rosh status/time/timer"',
    EffectConfig.PUBLIC
);

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
    "lastRoshDeathTimeTopic",
    {
        persistAcrossRestarts: true,
    }
);

const roshanAliveMessageTopic = topicManager.createTopic<string>(
    "roshanAliveMessageTopic",
    {
        persistAcrossRestarts: true,
    }
);
const roshanStatusMessageTopic = topicManager.createTopic<string>(
    "roshanStatusMessageTopic",
    {
        defaultValue: "Roshan status is unknown",
        persistAcrossRestarts: true,
    }
);

function isRoshStatusRequest(message: string) {
    return message.match(/^(what).{1,15}(status|timer?).{0,15}$/i) !== null;
}

function roshLocation(daytime: boolean) {
    return daytime ? "bottom" : "top";
}

/**
 * Sets roshanAliveMessageTopic based on how many times we have killed Roshan
 */
const aliveMessageRules = [
    new Rule({
        label: "never killed before",
        trigger: [topics.daytime],
        given: [allRoshanDeathTimesTopic],
        when: (_, [deathTimes]) => deathTimes.length === 0,
        then: ([daytime]) =>
            new Fact(
                roshanAliveMessageTopic,
                `Roshan is alive ${roshLocation(daytime)}`
            ),
    }),
    new Rule({
        label: "killed once before",
        trigger: [allRoshanDeathTimesTopic, topics.daytime],
        when: ([deathTimes]) => deathTimes.length === 1,
        then: ([_, daytime]) =>
            new Fact(
                roshanAliveMessageTopic,
                `Roshan is alive ${roshLocation(
                    daytime
                )}. Will drop aegis and cheese`
            ),
    }),
    new Rule({
        label: "killed twice or more, day time",
        trigger: [allRoshanDeathTimesTopic, topics.daytime],
        when: ([deathTimes, daytime]) => deathTimes.length > 1 && daytime,
        then: ([_, daytime]) =>
            new Fact(
                roshanAliveMessageTopic,
                `Roshan is alive ${roshLocation(
                    daytime
                )}. Will drop aegis, cheese, and aghanim's blessing`
            ),
    }),
    new Rule({
        label: "killed twice or more, night time",
        trigger: [allRoshanDeathTimesTopic, topics.daytime],
        when: ([deathTimes, daytime]) => deathTimes.length > 1 && !daytime,
        then: ([_, daytime]) =>
            new Fact(
                roshanAliveMessageTopic,
                `Roshan is alive ${roshLocation(
                    daytime
                )}. Will drop aegis, cheese, and refresher shard`
            ),
    }),
];

/**
 * Sets roshanStatus based on if rosh is dead or alive (
 */
const statusMessageRules = [
    ...aliveMessageRules,
    new Rule({
        label: "rosh is dead",
        trigger: [topics.roshanStatus],
        given: [topics.roshanMaybeAliveTime],
        when: ([status]) => status === Status.DEAD,
        then: (_, [maybeAliveTime]) =>
            new Fact(
                roshanStatusMessageTopic,
                `minimum ${timeHelper.secondsToTtsTimeString(maybeAliveTime)}`
            ),
    }),
    new Rule({
        label: "rosh may be alive",
        trigger: [
            topics.roshanStatus,
            topics.roshanPercentChanceAlive,
            topics.daytime,
        ],
        given: [topics.roshanAliveTime],
        when: ([status]) => status === Status.MAYBE_ALIVE,
        then: ([_, percentChance, daytime], [aliveTime]) =>
            new Fact(
                roshanStatusMessageTopic,
                `${percentChance} percent ${roshLocation(
                    daytime
                )}. maximum ${timeHelper.secondsToTtsTimeString(aliveTime)}`
            ),
    }),
    new Rule({
        label: "roshan is alive",
        trigger: [topics.roshanStatus, roshanAliveMessageTopic],
        when: ([status]) => status === Status.ALIVE,
        then: ([_, aliveMessage]) =>
            new Fact(roshanStatusMessageTopic, aliveMessage),
    }),
];

export default [
    new Rule({
        label: "percent chance roshan is alive",
        trigger: [topics.time, topics.roshanStatus, lastRoshDeathTimeTopic],
        when: ([_, status]) => status === Status.MAYBE_ALIVE,
        then: ([time, _, deathTime]) =>
            new Fact(
                topics.roshanPercentChanceAlive,
                roshHelper.percentChanceRoshanIsAlive(time, deathTime)
            ),
    }),
    ...statusMessageRules,
    new Rule({
        label: "when we get an event that says rosh is killed, add time to allRoshanDeathTimesTopic array",
        trigger: [topics.event],
        given: [topics.time, allRoshanDeathTimesTopic],
        when: ([event]) => event.type === EventType.RoshanKilled,
        then: (_, [time, deathTimes]) =>
            new Fact(allRoshanDeathTimesTopic, [...deathTimes, time]),
    }),

    new Rule({
        label: "last roshan death time from array of all roshan death times",
        trigger: [allRoshanDeathTimesTopic],
        then: ([deathTimes]) =>
            new Fact(lastRoshDeathTimeTopic, deathTimes.at(-1)),
    }),
    new Rule({
        label: "set aegis expiry, minimum, and maximum rosh respawn times",
        trigger: [lastRoshDeathTimeTopic],
        then: ([deathTime]) => [
            new Fact(
                topics.roshanAegisExpiryTime,
                roshHelper.aegisExpiryTime(deathTime)
            ),
            new Fact(
                topics.roshanMaybeAliveTime,
                roshHelper.minimuSpawnTime(deathTime)
            ),
            new Fact(
                topics.roshanAliveTime,
                roshHelper.maximumSpawnTime(deathTime)
            ),
        ],
    }),

    new Rule({
        label: "current roshan status",
        trigger: [topics.inGame, topics.time],
        given: [lastRoshDeathTimeTopic],
        then: ([inGame, time], [deathTime]) =>
            new Fact(
                topics.roshanStatus,
                roshHelper.getStatus(inGame, time, deathTime)
            ),
    }),

    new Rule({
        label: "when rosh may be up, play reminder",
        trigger: [topics.time],
        given: [topics.roshanMaybeAliveTime],
        when: ([time], [maybeAliveTime]) => time === maybeAliveTime,
        then: () =>
            new Fact(
                topics.configurableEffect,
                "resources/audio/rosh-maybe.mp3"
            ),
    }),
    new Rule({
        label: "when rosh is guaranteed to be up, play reminder",
        trigger: [topics.time],
        given: [topics.roshanAliveTime],
        when: ([time], [aliveTime]) => time === aliveTime,
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
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
