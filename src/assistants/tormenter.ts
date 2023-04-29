import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
import Rule from "../engine/Rule";
import RuleDecoratorAtMinute from "../engine/RuleDecoratorAtMinute";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
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
        new RuleDecoratorConfigurable(
            configTopic,
            new Rule({
                label: rules.assistant.tormenter,
                then: () =>
                    new Fact(
                        topics.configurableEffect,
                        "resources/audio/tormenters-up.mp3"
                    ),
            })
        )
    ),
    new RuleDecoratorConfigurable(
        configTopic,
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
        })
    ),
    new RuleDecoratorConfigurable(
        configTopic,
        new Rule({
            label: "tormenter voice",
            trigger: [topics.lastDiscordUtterance],
            given: [topics.time, tormenterFallenTimeTopic],
            then: ([lastDiscordUtterance], [time, fallenTime]) => {
                if (lastDiscordUtterance.match(/^torment has fallen$/i)) {
                    return [
                        new Fact(tormenterFallenTimeTopic, time),
                        new Fact(topics.configurableEffect, "OK"),
                    ];
                }
                if (lastDiscordUtterance.match(/^torment status$/i)) {
                    let message: string;
                    if (fallenTime) {
                        message = `Tormenter is dead. Will respawn at ${
                            (helper.secondsToTimeString(fallenTime + 10 * 60),
                            true)
                        }`;
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
                }
            },
        })
    ),
].map((rule) => new RuleDecoratorInGame(rule));
