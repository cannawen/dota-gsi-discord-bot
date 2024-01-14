import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.glhf,
    "Good luck and have fun",
    "Wishes you good fortune at the start of the game",
    EffectConfig.PUBLIC
);

export default configurable(
    configInfo.ruleIndentifier,
    new Rule({
        label: "says gl hf when game starts",
        trigger: [topics.inGame],
        given: [topics.time],
        when: ([inGame], [time]) => inGame && time === 0,
        then: () =>
            new Fact(topics.configurableEffect, "good luck and have fun"),
    })
);
