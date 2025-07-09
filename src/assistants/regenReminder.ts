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

const REGEN_REMINDER_INTERVAL = 60;
const REGEN_REMINDER_STOP_TIME = 8 * 60

function hasEnoughRegen(items: PlayerItems): boolean {
    return ( hasEnoughHealthRegen(items) && hasEnoughManaRegen(items) ) || 
        hasBottle(items);
}

function hasBottle(items: PlayerItems): boolean {
    if (items.allItems().find((item) => item?.id === "item_bottle")) {
        return true;
    } else {
        return false;
    }
}

// Health regen

function hasEnoughHealthRegen(items: PlayerItems): boolean {
    return hasTangos(items) || !onLastTango(items) || hasSalve(items) || hasFaerieFire(items) || hasTranquilBoots(items);
}

function hasTangos(items: PlayerItems): boolean {
    if ( items.allItems().find((item) => item?.id === "item_tango") ||
        items.allItems().find((item) => item?.id === "item_tango_single")) {
        return true;
    } else {
        return false;
    }
}

function onLastTango(items: PlayerItems): boolean {
    const tangos = items.allItems().find((item) => item?.id === "item_tango");
    if (tangos) {
        return tangos.charges === 1;
    } else {
        return false;
    }
}

function hasSalve(items: PlayerItems): boolean {
    if (items.allItems().find((item) => item?.id === "item_salve")) {
        return true;
    } else {
        return false;
    }
}

function hasFaerieFire(items: PlayerItems): boolean {
    if (items.allItems().find((item) => item?.id === "item_faerie_fire")) {
        return true;
    } else {
        return false;
    }
}

function hasTranquilBoots(items: PlayerItems): boolean {
    if (items.allItems().find((item) => item?.id === "item_tranquil_boots")) {
        return true;
    } else {
        return false;
    }
}

// Mana regen

function hasEnoughManaRegen(items: PlayerItems): boolean {
    return hasClarity(items) || hasMango(items) || hasManaBoots(items);
}
function hasClarity(items: PlayerItems): boolean {
    if (items.allItems().find((item) => item?.id === "item_clarity")) {
        return true;
    } else {
        return false;
    }
}

function hasMango(items: PlayerItems): boolean {
    if (items.allItems().find((item) => item?.id === "item_enchanted_mango")) {
        return true;
    } else {
        return false;
    }
}

function hasManaBoots(items: PlayerItems): boolean {
    if (items.allItems().find((item) => item?.id === "item_arcane_boots")) {
        return true;
    } else {
        return false;
    }
}

export default [
    new Rule({
        label: "inform user to buy regen",
        trigger: [topics.time, topics.items],
        when: ([time, items]) => time < REGEN_REMINDER_STOP_TIME && !hasEnoughRegen(items),
        then: () => new Fact(topics.configurableEffect, "buy more regen."),
    }),
]
    .map((rule) =>
        conditionalEveryIntervalSeconds(REGEN_REMINDER_INTERVAL, rule)
    )

    .map(inGame)
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
