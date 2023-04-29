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

const hasBuybackTopic = topicManager.createTopic<boolean>("hasBuybackTopic");

export default [
    new RuleDecoratorStartAndEndMinute(
        30,
        undefined,
        new Rule(
            {label: "when buyback is available",
        trigger:[topics.buybackCooldown, topics.gold, topics.buybackCost],
        when:(_get, [cooldown]) => cooldown === 0,
        then:(_get, [_, gold, cost]) => new Fact(hasBuybackTopic, gold >= cost)
    }
    ),
    new RuleDecoratorStartAndEndMinute(
        30,
        undefined,
        new Rule(
            "when buyback is not available",
            [topics.buybackCooldown, topics.gold, topics.buybackCost],
            () => {},
            ([cooldown]) => cooldown !== 0,
            () => new Fact(hasBuybackTopic, false)
        )
    ),
    new RuleDecoratorConfigurable(
        configTopic,
        new Rule(
            "warn about buyback",
            [hasBuybackTopic, topics.buybackCooldown],
            () => {},
            ([hasBuyback, cooldown]) => !hasBuyback && cooldown === 0,
            () =>
                new Fact(
                    topics.configurableEffect,
                    "you do not have buyback gold"
                )
        )
    ),
].map((rule) => new RuleDecoratorInGame(rule));
