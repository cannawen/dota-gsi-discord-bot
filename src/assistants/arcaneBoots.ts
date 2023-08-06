import conditionalEveryIntervalSeconds from "../engine/rules/conditionalEveryIntervalSeconds";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import helper from "./helpers/items";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.arcaneBoots,
    "Arcane boots",
    "Reminds you when your arcane boots are off cooldown and you are missing mana",
    EffectConfig.PRIVATE
);

const REMINDER_INTERVAL_SECONDS = 10;
const MANA_RESTORED_ON_CAST = 175;

export default [
    new Rule({
        label: "arcane boots",
        trigger: [topics.items],
        given: [topics.alive, topics.mana, topics.maxMana],
        when: ([items], [alive, mana, maxMana]) =>
            alive &&
            helper.hasCastableItem(items, "item_arcane_boots") &&
            maxMana - mana >= MANA_RESTORED_ON_CAST,
        then: () => new Fact(topics.configurableEffect, "arcane boots"),
    }),
]
    .map((rule) =>
        conditionalEveryIntervalSeconds(REMINDER_INTERVAL_SECONDS, rule)
    )
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
