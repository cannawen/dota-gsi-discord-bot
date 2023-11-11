import roshHelper, { Status } from "./helpers/roshan";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import { EventType } from "../gsi-data-classes/Event";
import Fact from "../engine/Fact";
import inRegularGame from "../engine/rules/inRegularGame";
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

const lastRoshDeathTimeTopic = topicManager.createTopic<number>(
    "lastRoshDeathTimeTopic",
    {
        persistAcrossRestarts: true,
    }
);

function isRoshStatusRequest(message: string) {
    return message.match(/^(what).{1,15}(status|timer?).{0,15}$/i) !== null;
}

function dropString(roshDeaths: number[], daytime: boolean) {
    let dropString = "";
    if (roshDeaths.length === 1) {
        dropString += " with cheese";
    }
    if (roshDeaths.length > 1) {
        if (daytime === true) {
            dropString += " with cheese and aghanim's";
        } else {
            dropString += " with cheese and refresher";
        }
    }
    return dropString;
}

function roshanNumberString(roshDeaths: number[]) {
    return `roshan number ${roshDeaths.length + 1}`;
}

function roshanMessage(
    allRoshDeathTimes: number[],
    currentTime: number,
    daytime: boolean,
    currentlyInGame: boolean
) {
    const deathTime = allRoshDeathTimes.at(-1);
    const status = roshHelper.getStatus(
        currentlyInGame,
        currentTime,
        deathTime
    );
    const roshLocation = daytime ? "bottom" : "top";
    switch (status) {
        case Status.ALIVE: {
            return `alive ${roshLocation}${dropString(
                allRoshDeathTimes,
                daytime
            )}`;
        }
        case Status.MAYBE_ALIVE:
            return `${roshHelper.percentChanceRoshanIsAlive(
                currentTime,
                deathTime!
            )} percent ${roshLocation}. maximum ${timeHelper.secondsToTtsTimeString(
                roshHelper.maximumSpawnTime(deathTime!)
            )} ${roshanNumberString(allRoshDeathTimes)}`;
        case Status.DEAD:
            return `minimum ${timeHelper.secondsToTtsTimeString(
                roshHelper.minimuSpawnTime(deathTime!)
            )} ${roshanNumberString(allRoshDeathTimes)}`;
        case Status.NOT_IN_A_GAME:
            return "game has not started";
        default:
            return "unknown";
    }
}

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
    new Rule({
        label: "when we get an event that says rosh is killed, add time to allRoshanDeathTimesTopic array",
        trigger: [topics.event],
        given: [topics.time, topics.allRoshanDeathTimes],
        when: ([event]) => event.type === EventType.RoshanKilled,
        then: (_, [time, deathTimes]) =>
            new Fact(topics.allRoshanDeathTimes, [...deathTimes, time]),
    }),

    new Rule({
        label: "last roshan death time from array of all roshan death times",
        trigger: [topics.allRoshanDeathTimes],
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
                topics.roshanMinimumSpawnTime,
                roshHelper.minimuSpawnTime(deathTime)
            ),
            new Fact(
                topics.roshanMaximumSpawnTime,
                roshHelper.maximumSpawnTime(deathTime)
            ),
        ],
    }),

    new Rule({
        label: "save current roshan status",
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
        given: [topics.roshanMinimumSpawnTime],
        when: ([time], [minimumSpawnTime]) => time === minimumSpawnTime,
        then: () =>
            new Fact(
                topics.configurableEffect,
                "resources/audio/rosh-maybe.mp3"
            ),
    }),
    new Rule({
        label: "when rosh is guaranteed to be up, play reminder",
        trigger: [topics.time],
        given: [
            topics.roshanMaximumSpawnTime,
            topics.daytime,
            topics.allRoshanDeathTimes,
        ],
        when: ([time], [maximumSpawnTime]) => time === maximumSpawnTime,
        then: (_, [_aliveTime, daytime]) =>
            new Fact(
                topics.configurableEffect,
                daytime
                    ? "resources/audio/rosh-bottom.mp3"
                    : "resources/audio/rosh-top.mp3"
            ),
    }),
]
    .concat([
        new Rule({
            label: "when asked what roshan status is, respond with status",
            trigger: [topics.lastDiscordUtterance],
            given: [
                topics.allRoshanDeathTimes,
                topics.time,
                topics.daytime,
                topics.inGame,
            ],
            when: ([utterance]) => isRoshStatusRequest(utterance),
            then: (_, [allDeathTimes, time, daytime, currentlyInGame]) =>
                new Fact(
                    topics.configurableEffect,
                    roshanMessage(allDeathTimes, time, daytime, currentlyInGame)
                ),
        }),
    ])
    .map((rule) => configurable(configInfo.ruleIndentifier, rule))
    .map(inRegularGame);
