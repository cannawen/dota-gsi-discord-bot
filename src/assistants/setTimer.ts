import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inRegularGame from "../engine/rules/inRegularGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.timer,
    "Custom Timer",
    `Responds to "set timer for x minutes/seconds" or "set buyback timer"`,
    EffectConfig.PUBLIC
);

interface TimerData {
    time: number;
    audio: string;
}

const timerDataTopic = topicManager.createTopic<TimerData[]>("timerDataTopic", {
    defaultValue: [],
    persistAcrossRestarts: true,
});

export default [
    new Rule({
        label: `sets buyback timer reminder for 8 minutes in the future`,
        trigger: [topics.lastDiscordUtterance],
        given: [topics.time, timerDataTopic],
        when: ([utterance]) =>
            utterance.match(/^set (buy|my|by) ?back timer$/i),
        then: (_, [time, currentTimers]) => [
            new Fact(topics.configurableEffect, "resources/audio/success.mp3"),
            new Fact(
                timerDataTopic,
                currentTimers.concat({
                    audio: "buyback timer up.",
                    time: time + 480,
                })
            ),
        ],
    }),
    new Rule({
        label: `sets minute timer`,
        trigger: [topics.lastDiscordUtterance],
        given: [topics.time, timerDataTopic],
        when: ([utterance]) =>
            utterance.match(
                /^(set timer for \d+ minutes?)|(set \d+.minutes? timer)$/i
            ),
        then: ([utterance], [time, currentTimers]) => [
            new Fact(topics.configurableEffect, "resources/audio/success.mp3"),
            new Fact(
                timerDataTopic,
                currentTimers.concat({
                    audio: `${utterance.match(/\d+/)[0]} minutes have passed.`,
                    time: time + parseInt(utterance.match(/\d+/)[0], 10) * 60,
                })
            ),
        ],
    }),
    new Rule({
        label: `sets seconds timer`,
        trigger: [topics.lastDiscordUtterance],
        given: [topics.time, timerDataTopic],
        when: ([utterance]) =>
            utterance.match(
                /^(set timer for \d+ seconds?)|(set \d+.seconds? timer)$/i
            ),
        then: ([utterance], [time, currentTimers]) => [
            new Fact(topics.configurableEffect, "resources/audio/success.mp3"),
            new Fact(
                timerDataTopic,
                currentTimers.concat({
                    audio: `${utterance.match(/\d+/)[0]} seconds have passed.`,
                    time: time + parseInt(utterance.match(/\d+/)[0], 10),
                })
            ),
        ],
    }),
    new Rule({
        label: "play reminder audio for timers",
        trigger: [topics.time],
        given: [timerDataTopic],
        when: ([time], [timerData]) =>
            (timerData as TimerData[])[0]?.time === time,
        then: (_, [timerData]) => [
            new Fact(topics.configurableEffect, timerData[0].audio),
            new Fact(timerDataTopic, timerData.slice(1)),
        ],
    }),
]
    .map((rule) => configurable(configInfo.ruleIndentifier, rule))
    .map(inRegularGame);
