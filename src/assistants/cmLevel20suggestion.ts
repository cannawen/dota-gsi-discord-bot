import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.cm20Talent,
    "CM 20 talent",
    "Suggest you take cm level 20 attack speed talent when useful",
    EffectConfig.PRIVATE
);

const attackSpeedUsefulAgainst = [
    "npc_dota_hero_ancient_apparition",
    "npc_dota_hero_clinkz",
    "npc_dota_hero_rattletrap",
    "npc_dota_hero_grimstroke",
    "npc_dota_hero_gyrocopter",
    "npc_dota_hero_keeper_of_the_light",
    "npc_dota_hero_lich",
    "npc_dota_hero_phoenix",
    "npc_dota_hero_pugna",
    "npc_dota_hero_shadow_shaman",
    "npc_dota_hero_techies",
    "npc_dota_hero_tidehunter",
    "npc_dota_hero_undying",
    "npc_dota_hero_venomancer",
    "npc_dota_hero_weaver",
];

function hasEnemyWhereAttackSpeedIsUseful(enemies: Set<string>) {
    return [...enemies].reduce(
        (memo, enemy) => memo || attackSpeedUsefulAgainst.includes(enemy),
        false
    );
}

export default configurable(
    configInfo.ruleIndentifier,
    new Rule({
        label: "Suggest level 20 attack speed talent when playing CM when useful",
        trigger: [topics.level],
        given: [topics.hero, topics.allEnemyHeroes],
        when: ([level], [hero, enemies]) =>
            level === 20 &&
            hero === "npc_dota_hero_crystal_maiden" &&
            hasEnemyWhereAttackSpeedIsUseful(enemies),
        then: () =>
            new Fact(topics.configurableEffect, "consider attack speed talent"),
    })
);
