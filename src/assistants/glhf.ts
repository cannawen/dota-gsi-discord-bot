import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/rules/RuleDecoratorConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(rules.assistant.glhf);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription =
    "Wishes you good fortune at the start of the game";

export default new RuleDecoratorConfigurable(
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
