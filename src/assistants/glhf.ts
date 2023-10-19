import ConfigInfo from "../ConfigInfo";
import configurableRegularGame from "../engine/rules/configurableRegularGame";
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

export default configurableRegularGame(
    configInfo.ruleIndentifier,
    new Rule({
        label: "says gl hf when game starts",
        trigger: [topics.inGame],
        given: [topics.time],
        when: ([inGame], [time]) => inGame && time === 0,
        then: () =>
            new Fact(topics.configurableEffect, "resources/audio/glhf.mp3"),
    })
);
