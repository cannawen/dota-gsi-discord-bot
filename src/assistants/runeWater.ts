import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleDecoratorAtMinute from "../engine/rules/RuleDecoratorAtMinute";
import RuleDecoratorConfigurable from "../engine/rules/RuleDecoratorConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.runeWater
);
export const defaultConfig = EffectConfig.NONE;
export const assistantDescription =
    "Reminds you of water rune spawn at 2:00 and 4:00";

export default [2, 4].map(
    (time) =>
        new RuleDecoratorAtMinute(
            time,
            new RuleDecoratorConfigurable(
                configTopic,
                new Rule({
                    label: rules.assistant.runeWater,
                    then: () =>
                        new Fact(
                            topics.configurableEffect,
                            "resources/audio/rune-water.mp3"
                        ),
                })
            )
        )
);
