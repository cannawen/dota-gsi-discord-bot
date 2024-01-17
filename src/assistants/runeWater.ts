import atMinute from "../engine/rules/atMinute";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inRegularGame from "../engine/rules/inRegularGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.runeWater,
    "Water rune",
    "Reminds you of water rune spawn at 2:00 and 4:00",
    EffectConfig.NONE
);

export default [2, 4]
    .map((time) =>
        atMinute(
            time,
            configurable(
                configInfo.ruleIndentifier,
                new Rule({
                    label: "water rune reminder at 2:00 and 4:00",
                    then: () =>
                        new Fact(topics.configurableEffect, "water runes."),
                })
            )
        )
    )
    .map(inRegularGame);
