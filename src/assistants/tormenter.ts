import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
import RuleConfigurable from "../engine/RuleConfigurable";
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
    new RuleConfigurable(
        rules.assistant.tormenter,
        configTopic,
        [topics.time],
        (get, effect) => {
            const time = get(topics.time)!;
            if (time === 20 * 60) {
                return new Fact(effect, "tormenter has spawned");
            }
        }
    ),
    new RuleConfigurable(
        "tormenter reminder",
        configTopic,
        [topics.time, tormenterFallenTimeTopic],
        (get, effect) => {
            const time = get(topics.time);
            const fallenTime = get(tormenterFallenTimeTopic);
            if (time === fallenTime) {
                return [
                    new Fact(effect, "Tormenter has respawned"),
                    new Fact(tormenterFallenTimeTopic, undefined),
                ];
            }
        }
    ),
    new RuleConfigurable(
        "tormenter voice",
        configTopic,
        [topics.lastDiscordUtterance],
        (get, effect) => {
            const lastDiscordUtterance = get(topics.lastDiscordUtterance)!;
            if (lastDiscordUtterance.match(/torment has fallen/i)) {
                return [
                    new Fact(tormenterFallenTimeTopic, get(topics.time)),
                    new Fact(effect, "OK"),
                ];
            }
            if (lastDiscordUtterance.match(/torment status/i)) {
                const fallenTime = get(tormenterFallenTimeTopic);
                let message: string;
                if (fallenTime) {
                    message = `Tormenter is dead. Will respawn at ${helper.secondsToTimeString(
                        fallenTime + 10 * 60
                    )}`;
                } else if (get(topics.time)! >= 20 * 60) {
                    return new Fact(effect, "Tormenter is alive");
                } else {
                    return new Fact(
                        effect,
                        "Tormenter will spawn at 20 minutes"
                    );
                }
                return new Fact(effect, message);
            }
        }
    ),
].map((rule) => new RuleDecoratorInGame(rule));
