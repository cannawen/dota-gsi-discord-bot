import atMinute from "../engine/rules/atMinute";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.runeWater,
    EffectConfig.NONE
);
export const assistantDescription =
    "Reminds you of water rune spawn at 2:00 and 4:00";

export default [2, 4].map((time) =>
    atMinute(
        time,
        configurable(
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
