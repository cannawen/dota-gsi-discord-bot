import Ability from "../gsi-data-classes/Ability";
import alive from "../engine/rules/alive";
import betweenSeconds from "../engine/rules/betweenSeconds";
import conditionalEveryIntervalSeconds from "../engine/rules/conditionalEveryIntervalSeconds";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.wdUseQ,
    "Witch doctor Q helper (beta)",
    "Reminds you to use Q off cooldown",
    EffectConfig.NONE
);

const REMINDER_INTERVAL_SECONDS = 30;
const START_REMINDER_SECONDS = 10 * 60;

export default [
    new Rule({
        label: "am playing wd and q on cooldown",
        trigger: [topics.hero, topics.abilities],
        when: ([hero, abilities]) =>
            hero === "npc_dota_hero_witch_doctor" &&
            (abilities as Ability[]).reduce(
                (memo, ability) =>
                    memo ||
                    (ability.name === "witch_doctor_paralyzing_cask" &&
                        ability.cooldown === 0),
                false
            ),
        then: () => new Fact(topics.configurableEffect, "coconut."),
    }),
]
    .map(alive)
    .map((rule) =>
        conditionalEveryIntervalSeconds(REMINDER_INTERVAL_SECONDS, rule)
    )
    .map((rule) => betweenSeconds(START_REMINDER_SECONDS, undefined, rule))
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
