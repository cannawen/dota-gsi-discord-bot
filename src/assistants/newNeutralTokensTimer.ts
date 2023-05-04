import atMinute from "../engine/rules/atMinute";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import helper from "./helpers/neutralItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.newNeutralTokens,
    EffectConfig.PUBLIC
);
export const assistantDescription =
    "Reminds you when new neutral tokens are spawning";

export default helper.tierTimeInfo.map((time) =>
    atMinute(
        time,
        configurable(
            configTopic,
            new Rule({
                label: rules.assistant.newNeutralTokens,
                then: () =>
                    new Fact(topics.configurableEffect, "new neutral tokens"),
            })
        )
    )
);
