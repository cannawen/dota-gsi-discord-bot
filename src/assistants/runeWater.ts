import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorAtMinute from "../engine/RuleDecoratorAtMinute";
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
            new RuleConfigurable(
                configTopic,
                new Rule(
                    rules.assistant.runeWater,
                    [],
                    (get) =>
                        new Fact(
                            topics.effect,
                            "resources/audio/rune-water.mp3"
                        )
                )
            )
        )
);
