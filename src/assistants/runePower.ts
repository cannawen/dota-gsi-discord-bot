import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/rules/RuleDecoratorConfigurable";
import RuleDecoratorInGame from "../engine/rules/RuleDecoratorInGame";
import RuleDecoratorStartAndEndMinute from "../engine/rules/RuleDecoratorStartAndEndMinute";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const POWER_RUNE_SPAWN_INTERVAL = 2 * 60;

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.runePower
);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription =
    "Reminds you of power rune spawn every 2:00 after 6:00";

export default new RuleDecoratorStartAndEndMinute(
    6,
    undefined,
    new RuleDecoratorInGame(
        new RuleDecoratorConfigurable(
            configTopic,
            new Rule({
                label: rules.assistant.runePower,
                trigger: [topics.time],
                then: ([time]) => {
                    if (time % POWER_RUNE_SPAWN_INTERVAL === 0) {
                        return new Fact(
                            topics.configurableEffect,
                            "resources/audio/rune-power.wav"
                        );
                    }
                },
            })
        )
    )
);
