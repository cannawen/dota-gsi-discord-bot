import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
import Rule from "../engine/Rule";
import RuleDecoratorAtMinute from "../engine/rules/RuleDecoratorAtMinute";
import RuleDecoratorConfigurable from "../engine/rules/RuleDecoratorConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.newNeutralTokens
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    "Reminds you when new neutral tokens are spawning";

export default helper.neutral.tierTimeInfo.map(
    (time) =>
        new RuleDecoratorAtMinute(
            time,
            new RuleDecoratorConfigurable(
                configTopic,
                new Rule({
                    label: rules.assistant.newNeutralTokens,
                    then: () =>
                        new Fact(
                            topics.configurableEffect,
                            "resources/audio/new-neutral-tokens.mp3"
                        ),
                })
            )
        )
);
