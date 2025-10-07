import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.enemyInventoryCheck,
    "Check Enemy Inventory",
    "Reminds you to check enemy inventory when you are dead",
    EffectConfig.PRIVATE
);

export default
    [
        new Rule({
            label: "reminder to check enemy inventory when dead",
            trigger: [topics.alive],
            when: ([alive]) => !alive,
            then: () => new Fact(topics.configurableEffect, "Check enemy inventory"),
        })
    ]
    .map(inGame)
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
