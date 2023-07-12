import atMinute from "../engine/rules/atMinute";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import helper from "./helpers/neutralItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.newNeutralTokens,
    "New neutral tokens",
    "Reminds you when new neutral tokens are spawning",
    EffectConfig.PUBLIC
);

export default helper.tierTimeInfo.map((time) =>
    atMinute(
        time,
        configurable(
            configInfo.ruleIndentifier,
            new Rule({
                label: "reminder that new neutral tokens are out",
                then: () =>
                    new Fact(
                        topics.configurableEffect,
                        "resources/audio/new-neutral-tokens.mp3"
                    ),
            })
        )
    )
);
