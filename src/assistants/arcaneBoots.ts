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
    rules.assistant.arcaneBoots,
    "Arcane boots",
    "Reminds you when your arcane boots are off cooldown and you are missing mana",
    EffectConfig.PRIVATE
);

const REMINDER_INTERVAL_SECONDS = 30;
const MANA_RESTORED_ON_CAST = 175;

export default [
    new Rule({
        label: "arcane boots",
        trigger: [topics.items],
        given: [topics.mana, topics.maxMana],
        when: ([items], [mana, maxMana]) =>
            items.findItem("item_arcane_boots")?.canCast &&
            maxMana - mana >= MANA_RESTORED_ON_CAST,
        then: () => new Fact(topics.configurableEffect, "arcane boots."),
    }),
]
    .map(alive)
    .map(inGame)
    .map((rule) =>
        conditionalEveryIntervalSeconds(REMINDER_INTERVAL_SECONDS, rule)
    )
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
