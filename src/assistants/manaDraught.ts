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
    rules.assistant.manaDraught,
    "Mana Draught",
    "Reminds you when your mana draught is off cooldown and you are missing mana",
    EffectConfig.PRIVATE
);

const REMINDER_INTERVAL_SECONDS = 30;
const MANA_RESTORED_ON_CAST = 30;

export default [
    new Rule({
        label: "mana draught",
        trigger: [topics.items],
        given: [topics.mana, topics.maxMana],
        when: ([items], [mana, maxMana]) =>
            items.findItem("item_mana_draught")?.canCast &&
            maxMana - mana >= MANA_RESTORED_ON_CAST + maxMana * 0.04,
        then: () => new Fact(topics.configurableEffect, "mana draught."),
    }),
]
    .map(alive)
    .map(inGame)
    .map((rule) =>
        conditionalEveryIntervalSeconds(REMINDER_INTERVAL_SECONDS, rule)
    )
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
