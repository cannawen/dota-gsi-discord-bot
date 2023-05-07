import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.glhf,
    "Good luck and have fun",
    "Wishes you good fortune at the start of the game",
    EffectConfig.PRIVATE
);

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.glhf,
    EffectConfig.PRIVATE
);
export const assistantDescription =
    "Wishes you good fortune at the start of the game";

export default configurable(
    configTopic,
    new Rule({
        label: rules.assistant.glhf,
        trigger: [topics.inGame],
        given: [topics.time],
        when: ([inGame], [time]) => inGame && time === 0,
        then: () =>
            new Fact(topics.configurableEffect, "good luck and have fun"),
    })
);
