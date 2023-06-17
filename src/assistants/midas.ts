import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Item from "../gsi-data-classes/Item";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.midas,
    "Midas",
    "Reminds you to use your midas",
    EffectConfig.PRIVATE
);

const REMINDER_INTERVAL = 15;

const lastReminderTimeTopic = topicManager.createTopic<number>(
    "lastMidasReminderTimeTopic"
);
const canCastMidasTopic =
    topicManager.createTopic<boolean>("canCastMidasTopic");

function getMidas(items: PlayerItems): Item | undefined {
    return [...items.inventory, ...items.backpack]
        .filter((item): item is Item => item !== null)
        .find((item) => item!.id === "item_hand_of_midas");
}

export default [
    new Rule({
        label: "save state if midas available to cast",
        trigger: [topics.items, topics.alive],
        then: ([items, alive]) => {
            const midas = getMidas(items);
            // If we are dead or we have no midas, we cannot cast it
            if (!alive || midas === undefined) {
                return new Fact(canCastMidasTopic, false);
            } else {
                // If we have a midas, we can cast it if our cooldown is 0
                return new Fact(canCastMidasTopic, midas.cooldown === 0);
            }
        },
    }),
    new Rule({
        label: "when midas cannot be cast, clear last reminder time topic",
        trigger: [canCastMidasTopic],
        when: ([canCast]) => canCast === false,
        then: () => [new Fact(lastReminderTimeTopic, undefined)],
    }),
    new Rule({
        label: "if midas is castable but we have never warned before, do not warn but set the reminder time (to give user some grace time)",
        trigger: [topics.time, canCastMidasTopic],
        given: [lastReminderTimeTopic],
        when: ([_, canCastMidas], [lastReminderTime]) =>
            canCastMidas && lastReminderTime === undefined,
        then: ([time]) => new Fact(lastReminderTimeTopic, time),
    }),
    new Rule({
        label: "if midas is castable and it has been 15 seconds after our last reminder time, warn user about midas",
        trigger: [topics.time, canCastMidasTopic],
        given: [lastReminderTimeTopic],
        when: ([time, canCastMidas], [lastReminderTime]) =>
            canCastMidas && time === lastReminderTime + REMINDER_INTERVAL,
        then: ([time]) => [
            new Fact(lastReminderTimeTopic, time),
            new Fact(topics.configurableEffect, "resources/audio/midas.mp3"),
        ],
    }),
]
    .map((rule) => configurable(configInfo.ruleIndentifier, rule))
    .map(inGame);
