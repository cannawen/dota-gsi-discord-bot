import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
import Rule from "../engine/Rule";
import RuleDecoratorAtMinute from "../engine/RuleDecoratorAtMinute";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.newNeutralTokens
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    "Reminds you when new neutral tokens are spawning";

export default helper.neutral.spawnMinutes.map(
    (time) =>
        new RuleDecoratorAtMinute(
            time,
            new RuleDecoratorConfigurable(
                configTopic,
                new Rule(
                    rules.assistant.newNeutralTokens,
                    [],
                    (get) =>
                        new Fact(
                            topics.configurableEffect,
                            "New neutral tokens"
                        )
                )
            )
        )
);
