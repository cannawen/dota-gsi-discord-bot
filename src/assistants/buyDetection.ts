import betweenSeconds from "../engine/rules/betweenSeconds";
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
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.buyDetection,
    "Buy detection",
    "Reminds you to buy detection mid-game if are against invis heroes and you have available slots",
    EffectConfig.PRIVATE
);

const hasInvisEnemyTopic =
    topicManager.createTopic<boolean>("hasInvisEnemyTopic");

const TIME_BETWEEN_REMINDERS = 120;
const START_REMINDER_TIME = 16 * 60 + 30;

function hasDetection(items: PlayerItems): boolean {
    return (
        items.inventory.find(
            (item) =>
                item?.id === "item_dust" ||
                item?.id === "item_ward_dispenser" ||
                item?.id === "item_ward_sentry"
        ) !== undefined
    );
}

function hasInvisHero(heroes: string[]): boolean {
    return [
        "npc_dota_hero_bounty_hunter",
        "npc_dota_hero_clinkz",
        "npc_dota_hero_invoker",
        "npc_dota_hero_mirana",
        "npc_dota_hero_nyx_assassin",
        "npc_dota_hero_riki",
        "npc_dota_hero_sand_king",
        "npc_dota_hero_templar_assassin",
        "npc_dota_hero_weaver",
    ].reduce((memo, hero) => memo || heroes.includes(hero), false);
}

export default [
    new Rule({
        label: "set state if there is an invis enemy",
        trigger: [topics.allEnemyHeroes],
        when: ([heroes]) => hasInvisHero(heroes),
        then: () => new Fact(hasInvisEnemyTopic, true),
    }),
]
    .concat(
        [
            new Rule({
                label: "reminder to buy detection",
                trigger: [topics.items],
                given: [hasInvisEnemyTopic],
                when: ([items], [invisEnemy]) =>
                    invisEnemy &&
                    helper.hasOpenSlot(items) &&
                    !hasDetection(items),
                then: () =>
                    new Fact(topics.configurableEffect, "buy detection"),
            }),
        ].map((rule) =>
            conditionalEveryIntervalSeconds(TIME_BETWEEN_REMINDERS, rule)
        )
    )
    .map(inGame)
    .map((rule) => betweenSeconds(START_REMINDER_TIME, undefined, rule))
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
