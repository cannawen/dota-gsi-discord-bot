import alive from "../engine/rules/alive";
import conditionalEveryIntervalSeconds from "../engine/rules/conditionalEveryIntervalSeconds";
import ConfigInfo from "../ConfigInfo";
import configurableRegularGame from "../engine/rules/configurableRegularGame";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.neutralItemDigReminder,
    "Neutral item dig reminder",
    "Reminds you to use your Trust Shovel or Pirate Hat",
    EffectConfig.PRIVATE
);

const TIME_BETWEEN_REMINDERS = 15;

export default ["item_trusty_shovel", "item_pirate_hat"]
    .map(
        (itemId) =>
            new Rule({
                label: `reminder to dig ${itemId}`,
                trigger: [topics.items],
                when: ([items]) => items.findItem(itemId)?.canCast,
                then: () => new Fact(topics.configurableEffect, "dig"),
            })
    )
    .map((rule) =>
        conditionalEveryIntervalSeconds(TIME_BETWEEN_REMINDERS, rule)
    )
    .map(inGame)
    .map((rule) => configurableRegularGame(configInfo.ruleIndentifier, rule))
    .map(alive);
