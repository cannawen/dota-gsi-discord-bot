import roshHelper, { Status } from "./helpers/roshan";
import ConfigInfo from "../ConfigInfo";
import configurableRegularGame from "../engine/rules/configurableRegularGame";
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

function isRoshStatusRequest(message: string) {
    return message.match(/^(what).{1,15}(status|timer?).{0,15}$/i) !== null;
}

function dropString(roshDeaths: number, daytime: boolean | undefined) {
    let dropString = "";
    if (roshDeaths === 1) {
        dropString += " with cheese";
    }
    if (roshDeaths > 1) {
        if (daytime === undefined) {
            dropString += " with cheese and refresher or aghanim's";
        }
        if (daytime === true) {
            dropString += " with cheese and aghanim's";
        }
        if (daytime === false) {
            dropString += " with cheese and refresher";
        }
    }
    return dropString;
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
                allRoshDeathTimes.length,
                daytime
            )}`;
        }
        case Status.MAYBE_ALIVE:
            return `${roshHelper.percentChanceRoshanIsAlive(
                currentTime,
                deathTime!
            )} percent ${roshLocation}. maximum ${timeHelper.secondsToTtsTimeString(
                roshHelper.maximumSpawnTime(deathTime!)
            )}${dropString(allRoshDeathTimes.length, undefined)}`;
        case Status.DEAD:
            return `minimum ${timeHelper.secondsToTtsTimeString(
                roshHelper.minimuSpawnTime(deathTime!)
            )}${dropString(allRoshDeathTimes.length, undefined)}`;
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
        given: [
            topics.roshanAliveTime,
            topics.daytime,
            allRoshanDeathTimesTopic,
        ],
        when: ([time], [aliveTime]) => time === aliveTime,
        then: (_, [_aliveTime, daytime]) =>
            new Fact(
                topics.configurableEffect,
                daytime
                    ? "resources/audio/rosh-bottom.mp3"
                    : "resources/audio/rosh-top.mp3"
            ),
    }),
]
    .map(inGame)
    .concat([
        new Rule({
            label: "when asked what roshan status is, respond with status",
            trigger: [topics.lastDiscordUtterance],
            given: [
                allRoshanDeathTimesTopic,
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
    .map((rule) => configurableRegularGame(configInfo.ruleIndentifier, rule));
