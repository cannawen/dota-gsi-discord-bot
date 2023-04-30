import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
import inGame from "../engine/rules/inGame";
import Item from "../gsi-data-classes/Item";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.neutralItemDigReminder,
    EffectConfig.PRIVATE
);
export const assistantDescription =
    "Reminds you to use your Trust Shovel or Pirate Hat";

const VALID_NEUTRAL_ARRAY = [
    helper.neutral.item.trustyShovel,
    helper.neutral.item.pirateHat,
];
const TIME_BETWEEN_REMINDERS = 15;

const lastReminderTimeTopic = topicManager.createTopic<number>(
    "lastNeutralItemDigReminderTimeTopic"
);

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
        label: "reset reminder time",
        trigger: [topics.alive, topics.items],
        when: ([alive, items]) => !alive || !hasValidItem(items),
        then: () => new Fact(lastReminderTimeTopic, undefined),
    }),
    new Rule({
        label: "give user some grace time if we have never reminded before",
        trigger: [topics.alive, topics.items, topics.time],
        given: [lastReminderTimeTopic],
        when: ([alive, items, _], [lastReminderTime]) =>
            alive && hasValidItem(items) && lastReminderTime === undefined,
        then: ([_alive, _items, time]) => new Fact(lastReminderTimeTopic, time),
    }),
    new Rule({
        label: "remind user to dig and update last reminder time",
        trigger: [topics.time, lastReminderTimeTopic],
        when: ([time, lastReminderTime]) =>
            time >= lastReminderTime + TIME_BETWEEN_REMINDERS,
        then: ([time]) => [
            new Fact(topics.configurableEffect, "dig"),
            new Fact(lastReminderTimeTopic, time),
        ],
    }),
]
    .map(inGame)
    .map((rule) => configurable(configTopic, rule));
