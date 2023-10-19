import ConfigInfo from "../ConfigInfo";
import configurableRegularGame from "../engine/rules/configurableRegularGame";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import Topic from "../engine/Topic";
import topics from "../topics";

const TOWER_HEALTH_WARN_THRESHOLD = 700;

export const configInfo = new ConfigInfo(
    rules.assistant.freeFortification,
    "Free fortification",
    `Reminds you to use your free fort when your tower is below ${TOWER_HEALTH_WARN_THRESHOLD}hp (beta feature - does not know if you actually have a fort available). Requires v2+ of the GSI config file`,
    EffectConfig.NONE
);

const t1FreeFortWarnedAlready = new Topic<boolean>("t1FreeFortWarnedAlready");
const t2FreeFortWarnedAlready = new Topic<boolean>("t2FreeFortWarnedAlready");
const t3FreeFortWarnedAlready = new Topic<boolean>("t3FreeFortWarnedAlready");

const freeFortAudio = "resources/audio/free-fort.mp3";

export default [
    new Rule({
        label: "free fort for t1",
        trigger: [topics.t1TopHealth, topics.t1MidHealth, topics.t1BotHealth],
        given: [t1FreeFortWarnedAlready],
        when: ([top, mid, bot], [warnedAlready]) =>
            !warnedAlready &&
            (top < TOWER_HEALTH_WARN_THRESHOLD ||
                mid < TOWER_HEALTH_WARN_THRESHOLD ||
                bot < TOWER_HEALTH_WARN_THRESHOLD),
        then: () => [
            new Fact(topics.configurableEffect, freeFortAudio),
            new Fact(t1FreeFortWarnedAlready, true),
        ],
    }),
    new Rule({
        label: "free fort for t2",
        trigger: [topics.t2TopHealth, topics.t2MidHealth, topics.t2BotHealth],
        given: [t2FreeFortWarnedAlready],
        when: ([top, mid, bot], [warnedAlready]) =>
            !warnedAlready &&
            (top < TOWER_HEALTH_WARN_THRESHOLD ||
                mid < TOWER_HEALTH_WARN_THRESHOLD ||
                bot < TOWER_HEALTH_WARN_THRESHOLD),
        then: () => [
            new Fact(topics.configurableEffect, freeFortAudio),
            new Fact(t2FreeFortWarnedAlready, true),
        ],
    }),
    new Rule({
        label: "free fort for t3",
        trigger: [topics.t3TopHealth, topics.t3MidHealth, topics.t3BotHealth],
        given: [t3FreeFortWarnedAlready],
        when: ([top, mid, bot], [warnedAlready]) =>
            !warnedAlready &&
            (top < TOWER_HEALTH_WARN_THRESHOLD ||
                mid < TOWER_HEALTH_WARN_THRESHOLD ||
                bot < TOWER_HEALTH_WARN_THRESHOLD),
        then: () => [
            new Fact(topics.configurableEffect, freeFortAudio),
            new Fact(t3FreeFortWarnedAlready, true),
        ],
    }),
]
    .map(inGame)
    .map((rule) => configurableRegularGame(configInfo.ruleIndentifier, rule));
