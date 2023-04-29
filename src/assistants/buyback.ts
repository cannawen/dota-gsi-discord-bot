import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import RuleDecoratorStartAndEndMinute from "../engine/RuleDecoratorStartAndEndMinute";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.buyback
);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription =
    "Reminds you when you do not have enough gold for buyback (after 30:00)";

const hasGoldForBuybackTopic = topicManager.createTopic<boolean>(
    "hasGoldForBuybackTopic"
);

export default [
    new RuleDecoratorStartAndEndMinute(
        30,
        undefined,
        new Rule({
            label: "check to see if you have gold for buyback",
            trigger: [topics.gold, topics.buybackCost],
            then: ([gold, cost]) =>
                new Fact(hasGoldForBuybackTopic, gold >= cost),
        })
    ),
    new RuleDecoratorConfigurable(
        configTopic,
        new Rule({
            label: "warn if you have buyback cooldown available but do not have buyback due to gold",
            trigger: [hasGoldForBuybackTopic, topics.buybackCooldown],
            when: ([hasBuyback, cooldown]) => !hasBuyback && cooldown === 0,
            then: () =>
                new Fact(
                    topics.configurableEffect,
                    "you do not have buyback gold"
                ),
        })
    ),
].map((rule) => new RuleDecoratorInGame(rule));
