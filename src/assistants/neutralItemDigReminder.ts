import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
import Item from "../gsi-data-classes/Item";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.neutralItemDigReminder
);
export const defaultConfig = EffectConfig.PRIVATE;
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
    new Rule(
        "reset reminder time",
        [topics.alive, topics.items],
        () => {},
        ([alive, items]) => !alive || !hasValidItem(items),
        () => new Fact(lastReminderTimeTopic, undefined)
    ),
    new Rule(
        "give user some grace time if we have never reminded before",
        [topics.alive, topics.items, topics.time],
        () => {},
        ([alive, items, _], get) =>
            alive &&
            hasValidItem(items) &&
            get(lastReminderTimeTopic) === undefined,
        ([_alive, _items, time]) => new Fact(lastReminderTimeTopic, time)
    ),
    new Rule(
        "remind user to dig and update last reminder time",
        [topics.time, lastReminderTimeTopic],
        () => {},
        ([time, lastReminderTime]) =>
            time >= lastReminderTime + TIME_BETWEEN_REMINDERS,
        ([time, _]) => [
            new Fact(topics.configurableEffect, "dig"),
            new Fact(lastReminderTimeTopic, time),
        ]
    ),
].map(
    (rule) =>
        new RuleDecoratorInGame(
            new RuleDecoratorConfigurable(configTopic, rule)
        )
);
