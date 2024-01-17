import Ability from "../gsi-data-classes/Ability";
import alive from "../engine/rules/alive";
import betweenSeconds from "../engine/rules/betweenSeconds";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.wdToggleW,
    "Witch doctor W helper (beta)",
    "Reminds you to toggle W after using a spell if Rubick on the other team",
    EffectConfig.NONE
);

const qCastableLastTickTopic = topicManager.createTopic<boolean>(
    "qCastableLastTickTopic"
);
const eCastableLastTickTopic = topicManager.createTopic<boolean>(
    "eCastableLastTickTopic"
);
const dCastableLastTickTopic = topicManager.createTopic<boolean>(
    "dCastableLastTickTopic"
);
const rCastableLastTickTopic = topicManager.createTopic<boolean>(
    "rCastableLastTickTopic"
);

function isCastable(abilities: Ability[], abilityInQuestion: string) {
    return (
        abilities.find((a: Ability) => a.name === abilityInQuestion)
            ?.cooldown === 0
    );
}

function isQCastable(abilities: Ability[]) {
    return isCastable(abilities, "witch_doctor_paralyzing_cask");
}

function isECastable(abilities: Ability[]) {
    return isCastable(abilities, "witch_doctor_maledict");
}

function isDCastable(abilities: Ability[]) {
    return isCastable(abilities, "witch_doctor_voodoo_switcheroo");
}

function isRCastable(abilities: Ability[]) {
    return isCastable(abilities, "witch_doctor_death_ward");
}

function isWActive(abilities: Ability[]) {
    return (
        abilities.find(
            (a: Ability) => a.name === "witch_doctor_voodoo_restoration"
        )?.active === true
    );
}

function needToToggle(
    abilities: Ability[],
    pastQ: boolean,
    pastE: boolean,
    pastD: boolean,
    pastR: boolean
) {
    // if past spell was castable, but now is not castable, it means that the user has cast it
    // and we need to toggle w so rubick does not steal spell
    return (
        (pastQ && !isQCastable(abilities)) ||
        (pastE && !isECastable(abilities)) ||
        (pastD && !isDCastable(abilities)) ||
        (pastR && !isRCastable(abilities))
    );
}

const START_REMINDER_SECONDS = 10 * 60;

export default [
    new Rule({
        label: "am playing wd vs rubick and a spell has been cast",
        trigger: [topics.hero, topics.allEnemyHeroes, topics.abilities],
        given: [
            qCastableLastTickTopic,
            eCastableLastTickTopic,
            dCastableLastTickTopic,
            rCastableLastTickTopic,
        ],
        when: ([hero, enemies, abilities], [q, e, d, r]) =>
            hero === "npc_dota_hero_witch_doctor" &&
            enemies.includes("npc_dota_hero_rubick") &&
            needToToggle(abilities, q, e, d, r),
        then: ([_h, _e, abilities]) =>
            new Fact(
                topics.configurableEffect,
                isWActive(abilities) ? "w" : "w w"
            ),
    }),
    new Rule({
        label: "set if q, e, r are castable",
        trigger: [topics.hero, topics.abilities],
        when: ([hero]) => hero === "npc_dota_hero_witch_doctor",
        then: ([_, abilities]) => [
            new Fact(qCastableLastTickTopic, isQCastable(abilities)),
            new Fact(eCastableLastTickTopic, isECastable(abilities)),
            new Fact(dCastableLastTickTopic, isDCastable(abilities)),
            new Fact(rCastableLastTickTopic, isRCastable(abilities)),
        ],
    }),
]
    .map(alive)
    .map((rule) => betweenSeconds(START_REMINDER_SECONDS, undefined, rule))
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
