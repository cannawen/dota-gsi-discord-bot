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
    rules.assistant.polliwogCharm,
    "Polliwog Charm",
    "Reminds you when your Polliwog Charm is off cooldown and you are missing health",
    EffectConfig.PRIVATE
);

const REMINDER_INTERVAL_SECONDS = 30;
const HEALTH_RESTORED_ON_CAST = 8 * 14;

export default [
    new Rule({
        label: "Polliwog Charm",
        trigger: [topics.items],
        given: [topics.health, topics.maxHealth],
        when: ([items], [health, maxHealth]) =>
            items.findItem("item_polliwog_charm")?.canCast &&
            maxHealth - health >= HEALTH_RESTORED_ON_CAST,
        then: () => new Fact(topics.configurableEffect, "Polliwog Charm."),
    }),
]
    .map(alive)
    .map(inGame)
    .map((rule) =>
        conditionalEveryIntervalSeconds(REMINDER_INTERVAL_SECONDS, rule)
    )
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
