import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import RuleDecoratorAtMinute from "../engine/rules/RuleDecoratorAtMinute";
import RuleDecoratorConfigurable from "../engine/rules/RuleDecoratorConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.tormenter
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    'Reminds you of tormenter. Responds to "torment has fallen" and "torment status"';

const tormenterFallenTimeTopic = topicManager.createTopic<number>(
    "tormenterFallenTimeTopic",
    { persistAcrossRestarts: true }
);

export default [
    new RuleDecoratorAtMinute(
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
        when: ([utterance]) => utterance.match(/^torment status$/i),
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
    .map((rule) => new RuleDecoratorConfigurable(configTopic, rule));
