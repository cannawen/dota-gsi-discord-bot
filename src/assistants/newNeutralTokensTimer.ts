import atMinute from "../engine/rules/atMinute";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import helper from "./helpers/neutralItems";
import inRegularGame from "../engine/rules/inRegularGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.newNeutralTokens,
    "Madstone cap increase",
    "Reminds you when Madstone cap is increased",
    EffectConfig.PUBLIC
);

export default helper.tierTimeInfo
    .map((time) =>
        atMinute(
            time,
            configurable(
                configInfo.ruleIndentifier,
                new Rule({
                    label: "reminder that Madstone cap is increased",
                    then: () =>
                        new Fact(
                            topics.configurableEffect,
                            "Madstone cap increased."
                        ),
                })
            )
        )
    )
    .map(inRegularGame);
