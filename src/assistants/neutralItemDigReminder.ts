import alive from "../engine/rules/alive";
import conditionalEveryIntervalSeconds from "../engine/rules/conditionalEveryIntervalSeconds";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.neutralItemDigReminder,
    "Neutral item dig reminder (Deprecated)",
    "Reminds you to use your Trust Shovel",
    EffectConfig.PRIVATE
);

const TIME_BETWEEN_REMINDERS = 15;

export default ["item_trusty_shovel"]
    .map(
        (itemId) =>
            new Rule({
                label: `reminder to dig ${itemId}`,
                trigger: [topics.items],
                when: ([items]) => items.findItem(itemId)?.canCast,
                then: () => new Fact(topics.configurableEffect, "dig."),
            })
    )
    .map(alive)
    .map(inGame)
    .map((rule) =>
        conditionalEveryIntervalSeconds(TIME_BETWEEN_REMINDERS, rule)
    )
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
