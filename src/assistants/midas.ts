import conditionalEveryIntervalSeconds from "../engine/rules/conditionalEveryIntervalSeconds";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Item from "../gsi-data-classes/Item";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.midas,
    "Midas",
    "Reminds you to use your midas",
    EffectConfig.PRIVATE
);

const REMINDER_INTERVAL = 15;

function midasIsCastable(items: PlayerItems): boolean {
    return (
        [...items.inventory, ...items.backpack]
            .filter((item): item is Item => item !== null)
            .find((item) => item!.id === "item_hand_of_midas")?.cooldown === 0
    );
}

export default [
    new Rule({
        label: "reminder to use midas",
        trigger: [topics.alive, topics.items],
        then: () =>
            new Fact(topics.configurableEffect, "resources/audio/midas.mp3"),
    }),
]
    .map((rule) =>
        conditionalEveryIntervalSeconds(
            ([alive, items]) => midasIsCastable(items) && alive,
            REMINDER_INTERVAL,
            rule
        )
    )
    .map((rule) => configurable(configInfo.ruleIndentifier, rule))
    .map(inGame);
