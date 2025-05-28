import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import topicManager from "../engine/topicManager";

export const configInfo = new ConfigInfo(
    rules.assistant.shareUnitControl,
    "Share unit control",
    "Suggest you should share unit control with your teammates when applicable",
    EffectConfig.PRIVATE
);

const heroesWithSharableUnits = [
    "npc_dota_hero_broodmother",
    "npc_dota_hero_beastmaster",
    "npc_dota_hero_chaos_knight",
    "npc_dota_hero_chen",
    "npc_dota_hero_dark_seer",
    "npc_dota_hero_enchantress",
    "npc_dota_hero_enigma",
    "npc_dota_hero_invoker",
    "npc_dota_hero_juggernaut",
    "npc_dota_hero_lycan",
    "npc_dota_hero_meepo",
    "npc_dota_hero_naga_siren",
    "npc_dota_hero_furion",
    "npc_dota_hero_rubick",
    "npc_dota_hero_shadow_demon",
    "npc_dota_hero_templar_assassin",
    "npc_dota_hero_terrorblade",
    "npc_dota_hero_visage",
    "npc_dota_hero_warlock",
    "npc_dota_hero_witch_doctor",
];

const minionCreatingItems = [
    "item_necronomicon",
    "item_demonicon",
    "item_helm_of_the_dominator",
    "item_helm_of_the_overlord",
]

function hasMinionCreatingItem(items: PlayerItems): boolean {
    return (
        items.allItems().map(item => item?.id || "").find((itemId) => minionCreatingItems.includes(itemId)) !==
        undefined
    );
}

const suggestedShareUnitControlTopic = topicManager.createTopic("alreadySuggestedShareUnitControl", {persistAcrossRestarts: true, defaultValue: false})

export default 
[
    configurable(
        configInfo.ruleIndentifier,
        new Rule({
            label: "Suggest sharing unit control when hero applicable",
            trigger: [topics.time, topics.preGame],
            given: [topics.hero],
            when: ([time, pregame], [hero]) => pregame && time === -60 && heroesWithSharableUnits.includes(hero),
            then: () =>
                [
                    new Fact(
                        topics.configurableEffect,
                        "consider sharing unit control."
                    ),
                    new Fact(
                        suggestedShareUnitControlTopic,
                        true
                    )
                ]
        })
    ),
    inGame(configurable(
        configInfo.ruleIndentifier,
        new Rule({
            label: "Suggest sharing unit control when items applicable",
            trigger: [topics.items],
            given: [suggestedShareUnitControlTopic],
            when: ([items], [alreadyReminded]) => !alreadyReminded && hasMinionCreatingItem(items),
            then: () =>
                [
                    new Fact(
                        topics.configurableEffect,
                        "consider sharing unit control."
                    ),
                    new Fact(suggestedShareUnitControlTopic, true)
                ]
        })
    ))
];
