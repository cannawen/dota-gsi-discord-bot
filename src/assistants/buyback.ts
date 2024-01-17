import betweenSeconds from "../engine/rules/betweenSeconds";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.buyback,
    "Buyback",
    "Reminds you when you do not have enough gold for buyback (after 30:00)",
    EffectConfig.PRIVATE
);

const BUYBACK_RULE_START_TIME = 30 * 60;

const hasGoldForBuybackTopic = topicManager.createTopic<boolean>(
    "hasGoldForBuybackTopic"
);

export default [
    betweenSeconds(
        BUYBACK_RULE_START_TIME,
        undefined,
        new Rule({
            label: "check to see if you have gold for buyback",
            trigger: [topics.gold, topics.buybackCost],
            then: ([gold, cost]) =>
                new Fact(hasGoldForBuybackTopic, gold >= cost),
        })
    ),
    configurable(
        configInfo.ruleIndentifier,
        new Rule({
            label: "warn if you have buyback cooldown available but do not have buyback due to gold",
            trigger: [hasGoldForBuybackTopic, topics.buybackCooldown],
            when: ([hasBuyback, cooldown]) => !hasBuyback && cooldown === 0,
            then: () =>
                new Fact(
                    topics.configurableEffect,
                    "you do not have buyback gold."
                ),
        })
    ),
].map(inGame);
