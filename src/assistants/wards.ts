import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/rules/RuleDecoratorConfigurable";
import RuleDecoratorInGame from "../engine/rules/RuleDecoratorInGame";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.wards
);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription =
    "Reminds you to buy wards if you have not done so recently";

const WARD_RESTOCK_SECONDS = 135;
const MAX_WARDS_IN_STOCK = 4;
const WARD_REMINDER_INTERVAL = WARD_RESTOCK_SECONDS * MAX_WARDS_IN_STOCK;

const lastWardReminderTimeTopic = topicManager.createTopic<number>(
    "lastWardReminderTimeTopic"
);
const lastWardCountTopic =
    topicManager.createTopic<number>("lastWardCountTopic");

/**
 * NOTE: We do not actually know how many wards a player has
 * The item slots are labeled as `item_ward_observer` `item_ward_sentry` or `item_ward_dispenser`
 * But if they have some in their inventory and some in their stash, it will count as "two items"
 *
 * This means if you buy wards from fountain and it does not pass through your stash,
 * The app may not know your ward count has increased.
 */
export default new RuleDecoratorInGame(
    new RuleDecoratorConfigurable(
        configTopic,
        new Rule({
            label: rules.assistant.wards,
            trigger: [topics.time, topics.items],
            given: [lastWardReminderTimeTopic, lastWardCountTopic],
            then: ([time, items], [lastWardReminderTime, lastWardCount]) => {
                const facts: Fact<unknown>[] = [];

                const currentWardCount = (items as PlayerItems)
                    .allItems()
                    .filter(
                        (item) =>
                            item?.id === "item_ward_observer" ||
                            item?.id === "item_ward_sentry" ||
                            item?.id === "item_ward_dispenser"
                    ).length;
                if (lastWardCount !== currentWardCount) {
                    facts.push(new Fact(lastWardCountTopic, currentWardCount));
                }

                if (currentWardCount > lastWardCount) {
                    facts.push(new Fact(lastWardReminderTimeTopic, time));
                } else if (
                    time - lastWardReminderTime >=
                    WARD_REMINDER_INTERVAL
                ) {
                    facts.push(
                        new Fact(topics.configurableEffect, "buy wards")
                    );
                    facts.push(new Fact(lastWardReminderTimeTopic, time));
                }
                return facts;
            },
            defaultValues: [
                new Fact(lastWardReminderTimeTopic, 0),
                new Fact(lastWardCountTopic, 0),
            ],
        })
    )
);
