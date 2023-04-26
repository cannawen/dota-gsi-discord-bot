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
            new Rule(
                rules.assistant.tormenter,
                [],
                (get) =>
                    new Fact(
                        topics.configurableEffect,
                        "resources/audio/tormenters-up.mp3"
                    )
            )
        )
    ),
    new RuleDecoratorConfigurable(
        configTopic,
        new Rule(
            "tormenter reminder",
            [topics.time, tormenterFallenTimeTopic],
            (get) => {
                const time = get(topics.time);
                const fallenTime = get(tormenterFallenTimeTopic)!;
                if (time === fallenTime + 60 * 10) {
                    return [
                        new Fact(
                            topics.configurableEffect,
                            "resources/audio/tormenters-up.mp3"
                        ),
                        new Fact(tormenterFallenTimeTopic, undefined),
                    ];
                }
            }
        )
    ),
    new RuleDecoratorConfigurable(
        configTopic,
        new Rule("tormenter voice", [topics.lastDiscordUtterance], (get) => {
            const lastDiscordUtterance = get(topics.lastDiscordUtterance)!;
            if (lastDiscordUtterance.match(/^torment has fallen$/i)) {
                return [
                    new Fact(tormenterFallenTimeTopic, get(topics.time)),
                    new Fact(topics.configurableEffect, "OK"),
                ];
            }
            if (lastDiscordUtterance.match(/^torment status$/i)) {
                const fallenTime = get(tormenterFallenTimeTopic);
                let message: string;
                if (fallenTime) {
                    message = `Tormenter is dead. Will respawn at ${
                        (helper.secondsToTimeString(fallenTime + 10 * 60), true)
                    }`;
                } else if (get(topics.time)! >= 20 * 60) {
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
        })
    ),
].map((rule) => new RuleDecoratorInGame(rule));
