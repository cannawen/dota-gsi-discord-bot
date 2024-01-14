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
    rules.assistant.bloodGrenade,
    "Blood Grenade",
    "Reminds you to buy a blood grenade if you do not have one",
    EffectConfig.NONE
);

const BLOOD_GRENADE_REMINDER_INTERVAL = 120;

function hasBloodGrenade(items: PlayerItems): boolean {
    return (
        items.allItems().find((item) => item?.id === "item_blood_grenade") !==
        undefined
    );
}

export default [
    new Rule({
        label: "inform user to buy a blood grenade",
        trigger: [topics.items],
        when: ([items]) => !hasBloodGrenade(items) && helper.hasOpenSlot(items),
        then: () => new Fact(topics.configurableEffect, "buy a blood grenade"),
    }),
]
    .map((rule) =>
        conditionalEveryIntervalSeconds(BLOOD_GRENADE_REMINDER_INTERVAL, rule)
    )

    .map(inGame)
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
