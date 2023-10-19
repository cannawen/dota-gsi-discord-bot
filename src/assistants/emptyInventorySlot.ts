import conditionalEveryIntervalSeconds from "../engine/rules/conditionalEveryIntervalSeconds";
import ConfigInfo from "../ConfigInfo";
import configurableRegularGame from "../engine/rules/configurableRegularGame";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import neutralHelpers from "./helpers/neutralItems";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.emptyInventory,
    "Empty inventory slot",
    "Reminds you to put items from your backpack into inventory if there is an empty slot",
    EffectConfig.PRIVATE
);

const TIME_BETWEEN_REMINDERS = 30;

function canMoveItemFromBackpackToInventory(items: PlayerItems): boolean {
    const itemsInBackpack = items.backpack.filter(
        (item) =>
            item !== null &&
            !neutralHelpers.isNeutralItem(item.id) &&
            item.id.match(/recipe/) === null
    ).length;
    const inventorySlots = items.inventory.filter(
        (item) => item === null
    ).length;
    return inventorySlots > 0 && itemsInBackpack > 0;
}

export default [
    new Rule({
        label: "reminder to move item from backpack to inventory",
        trigger: [topics.items],
        when: ([items]) => canMoveItemFromBackpackToInventory(items),
        then: () =>
            new Fact(topics.configurableEffect, "move item to inventory"),
    }),
]
    .map((rule) =>
        conditionalEveryIntervalSeconds(TIME_BETWEEN_REMINDERS, rule)
    )
    .map(inGame)
    .map((rule) => configurableRegularGame(configInfo.ruleIndentifier, rule));
