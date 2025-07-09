import conditionalEveryIntervalSeconds from "../engine/rules/conditionalEveryIntervalSeconds";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import helper from "./helpers/items";
import inGame from "../engine/rules/inGame";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.regenReminder,
    "Reminder to buy regeneration",
    "Reminds you to regen in lane",
    EffectConfig.NONE
);

const REGEN_REMINDER_INTERVAL = 45;
const REGEN_REMINDER_STOP_TIME = 8 * 60

function hasEnoughHealthRegen(items: PlayerItems): boolean {
    return ["item_bottle", "item_tango", "item_tango_single", "item_salve", "item_faerie_fire", "item_tranquil_boots"]
        .reduce((acc, itemId) => {
            return acc || items.hasItem(itemId);
        }, false);
}

function hasEnoughManaRegen(items: PlayerItems): boolean {
    return ["item_bottle", "item_clarity", "item_enchanted_mango", "item_arcane_boots"]
        .reduce((acc, itemId) => {
            return acc || items.hasItem(itemId);
        }, false);
}

export default [
    new Rule({
        label: "inform user to buy health regen",
        trigger: [topics.time, topics.items],
        when: ([time, items]) => time < REGEN_REMINDER_STOP_TIME && !hasEnoughHealthRegen(items),
        then: () => new Fact(topics.configurableEffect, "buy more health regen."),
    }),
    new Rule({
        label: "inform user to buy mana regen",
        trigger: [topics.time, topics.items],
        when: ([time, items]) => time < REGEN_REMINDER_STOP_TIME && !hasEnoughManaRegen(items),
        then: () => new Fact(topics.configurableEffect, "buy more mana regen."),
    }),
]
    .map((rule) =>
        conditionalEveryIntervalSeconds(REGEN_REMINDER_INTERVAL, rule)
    )

    .map(inGame)
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
