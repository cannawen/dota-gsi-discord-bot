import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import everyIntervalSeconds from "../engine/rules/everyIntervalSeconds";
import Fact from "../engine/Fact";
import inRegularGame from "../engine/rules/inRegularGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.runeWisdom,
    "Wisdom shrine",
    'Reminds you of wisdom shrine every 7:00 starting at 6:30. Responds to voice command "next wisdom shrine"',
    EffectConfig.PUBLIC
);

const WISDOM_SHRINE_SAPWN_MINUTES = 7;
const WISDOM_SHRINE_SPAWN_SECONDS = WISDOM_SHRINE_SAPWN_MINUTES * 60;
const WISDOM_SHRINE_START_WARNING_TIME = WISDOM_SHRINE_SPAWN_SECONDS - 30;

export default [
    everyIntervalSeconds(
        WISDOM_SHRINE_START_WARNING_TIME,
        undefined,
        WISDOM_SHRINE_SPAWN_SECONDS,
        new Rule({
            label: "wisdom shrine soon reminder every 7:00",
            trigger: [topics.time],
            given: [topics.allEnemyHeroes],
            then: (_, [enemyHeroes]) =>
                new Fact(
                    topics.configurableEffect,
                    enemyHeroes.find(
                        (heroId: string) => heroId === "npc_dota_hero_furion"
                    )
                        ? "wisdom shrine soon. care natures TP."
                        : "wisdom shrine soon."
                ),
        })
    ),
    new Rule({
        label: "next wisdom shrine voice command",
        trigger: [topics.lastDiscordUtterance],
        given: [topics.time],
        when: ([utterance]) =>
            utterance.match(/^.ext wisdom.{0,15}$/i) !== null,
        then: (_, [time]) =>
            new Fact(
                topics.configurableEffect,
                `${Math.ceil(time / WISDOM_SHRINE_SPAWN_SECONDS) *
                WISDOM_SHRINE_SAPWN_MINUTES
                } minutes.`
            ),
    }),
]
    .map((rule) => configurable(configInfo.ruleIndentifier, rule))
    .map(inRegularGame);
