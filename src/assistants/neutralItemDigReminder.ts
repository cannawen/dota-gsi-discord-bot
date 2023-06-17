import conditionalEveryIntervalSeconds from "../engine/rules/conditionalEveryIntervalSeconds";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import helper from "./helpers/neutralItems";
import inGame from "../engine/rules/inGame";
import Item from "../gsi-data-classes/Item";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.neutralItemDigReminder,
    "Neutral item dig reminder",
    "Reminds you to use your Trust Shovel or Pirate Hat",
    EffectConfig.PRIVATE
);

const VALID_NEUTRAL_ARRAY = [helper.trustyShovel, helper.pirateHat];
const TIME_BETWEEN_REMINDERS = 15;

function validNeutralItem(item: Item | null): boolean {
    if (!item) {
        return false;
    }
    return VALID_NEUTRAL_ARRAY.reduce(
        (memo, validId) => memo || item.id === validId,
        false
    );
}

function canCast(item: Item | null): boolean {
    if (!item) {
        return false;
    }
    return item.cooldown === 0;
}

function hasValidItem(items: PlayerItems) {
    return (
        [...items.backpack, items.neutral]
            .filter(validNeutralItem)
            .filter(canCast).length > 0
    );
}
export default [
    new Rule({
        label: "reminder to dig trusty shovel or pirate hat",
        trigger: [topics.alive, topics.items],
        then: () => new Fact(topics.configurableEffect, "dig"),
    }),
]
    .map((rule) =>
        conditionalEveryIntervalSeconds(
            undefined,
            undefined,
            ([alive, items]) => hasValidItem(items) && alive,
            TIME_BETWEEN_REMINDERS,
            rule
        )
    )
    .map(inGame)
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
