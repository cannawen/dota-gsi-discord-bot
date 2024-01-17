import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inRegularGame from "../engine/rules/inRegularGame";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.wards,
    "Wards",
    "Reminds you to buy wards if you have not done so recently",
    EffectConfig.NONE
);

const WARD_RESTOCK_SECONDS = 135;
const MAX_WARDS_IN_STOCK = 4;
const WARD_REMINDER_INTERVAL = WARD_RESTOCK_SECONDS * MAX_WARDS_IN_STOCK;

const lastWardReminderTimeTopic = topicManager.createTopic<number>(
    "lastWardReminderTimeTopic",
    { defaultValue: 0 }
);
const lastWardCountTopic = topicManager.createTopic<number>(
    "lastWardCountTopic",
    { defaultValue: 0 }
);

/**
 * NOTE: We do not actually know how many wards a player has
 * The item slots are labeled as `item_ward_observer` `item_ward_sentry` or `item_ward_dispenser`
 * But if they have some in their inventory and some in their stash, it will count as "two items"
 *
 * This means if you buy wards from fountain and it does not pass through your stash,
 * The app may not know your ward count has increased.
 */
export default inRegularGame(
    configurable(
        configInfo.ruleIndentifier,
        new Rule({
            label: "reminder to buy wards if you have not done so recently",
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
                        new Fact(topics.configurableEffect, "buy wards.")
                    );
                    facts.push(new Fact(lastWardReminderTimeTopic, time));
                }
                return facts;
            },
        })
    )
);
