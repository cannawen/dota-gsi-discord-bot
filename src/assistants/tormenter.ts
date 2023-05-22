import atMinute from "../engine/rules/atMinute";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import helper from "./helpers/timeFormatting";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.tormenter,
    "Tormenter (beta feature)",
    'Reminds you of tormenter at 20:00. Responds to "torment has fallen" and "what is torment timer/status". Valve does not give the app an event when a tormenter dies, so you must tell the bot "torment has fallen" for it to track tormenter respawn times. (The speech to text is terrible at recognizing the word tormenter, so just call it a torment and at least then there\'s a 50% chance it will recognize it xd). Also currently only tracking one tormenter',
    EffectConfig.PUBLIC
);

const tormenterFallenTimeTopic = topicManager.createTopic<number>(
    "tormenterFallenTimeTopic",
    { persistAcrossRestarts: true }
);

function isTormentStatusRequest(message: string) {
    return (
        (message.match(/^(what).{1,15}(status|timer?)$/i) !== null &&
            message.match(/torment/) !== null) ||
        message.match(/^torment status$/i) !== null
    );
}

export default [
    atMinute(
        20,
        new Rule({
            label: rules.assistant.tormenter,
            then: () =>
                new Fact(
                    topics.configurableEffect,
                    "resources/audio/tormenters-up.mp3"
                ),
        })
    ),
    new Rule({
        label: "tormenter reminder",
        trigger: [topics.time, tormenterFallenTimeTopic],
        then: ([time, fallenTime]) => {
            if (time === fallenTime + 60 * 10) {
                return [
                    new Fact(
                        topics.configurableEffect,
                        "resources/audio/tormenters-up.mp3"
                    ),
                    new Fact(tormenterFallenTimeTopic, undefined),
                ];
            }
        },
    }),
    new Rule({
        label: "tormenter has fallen",
        trigger: [topics.lastDiscordUtterance],
        given: [topics.time],
        when: ([utterance]) => utterance.match(/^torment has fallen$/i),
        then: (_, [time]) => [
            new Fact(tormenterFallenTimeTopic, time),
            new Fact(topics.configurableEffect, "OK"),
        ],
    }),
    new Rule({
        label: "tormenter status",
        trigger: [topics.lastDiscordUtterance],
        given: [topics.time, tormenterFallenTimeTopic],
        when: ([utterance]) => isTormentStatusRequest(utterance),
        then: (_, [time, fallenTime]) => {
            let message: string;
            if (fallenTime) {
                message = `Tormenter is dead. Will respawn at ${helper.secondsToTtsTimeString(
                    fallenTime + 10 * 60
                )}`;
            } else if (time >= 20 * 60) {
                return new Fact(
                    topics.configurableEffect,
                    "resources/audio/tormenters-up.mp3"
                );
            } else {
                return new Fact(
                    topics.configurableEffect,
                    "resources/audio/tormenter-20-minutes.mp3"
                );
            }
            return new Fact(topics.configurableEffect, message);
        },
    }),
]
    .map(inGame)
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
