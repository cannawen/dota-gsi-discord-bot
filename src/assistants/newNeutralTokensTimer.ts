import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorAtMinute from "../engine/RuleDecoratorAtMinute";
import rules from "../rules";
import topicManager from "../engine/topicManager";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.newNeutralTokens
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    "Reminds you when new neutral tokens are spawning";

export default [7, 17, 27, 37, 60].map(
    (time) =>
        new RuleDecoratorAtMinute(
            time,
            new RuleConfigurable(
                rules.assistant.neutralItemDigReminder,
                configTopic,
                [],
                (get, effect) => new Fact(effect, "New neutral tokens")
            )
        )
);
