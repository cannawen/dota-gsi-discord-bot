import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
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
    `Reminds you to use your free fort when your tower is below ${TOWER_HEALTH_WARN_THRESHOLD}hp (does not know if you actually have a fort available). Requires v2+ of the GSI config file`,
    EffectConfig.PUBLIC_INTERRUPTING
);

const t1FreeFortWarnedAlready = new Topic<boolean>("t1FreeFortWarnedAlready");
const t2FreeFortWarnedAlready = new Topic<boolean>("t2FreeFortWarnedAlready");
const t3FreeFortWarnedAlready = new Topic<boolean>("t3FreeFortWarnedAlready");

export default [
    new Rule({
        label: "free fort for t1",
        trigger: [topics.t1Top, topics.t1Mid, topics.t1Bot],
        given: [t1FreeFortWarnedAlready],
        when: ([top, mid, bot], [warnedAlready]) =>
            !warnedAlready &&
            (top < TOWER_HEALTH_WARN_THRESHOLD ||
                mid < TOWER_HEALTH_WARN_THRESHOLD ||
                bot < TOWER_HEALTH_WARN_THRESHOLD),
        then: () => [
            new Fact(topics.configurableEffect, "free fort"),
            new Fact(t1FreeFortWarnedAlready, true),
        ],
    }),
    new Rule({
        label: "free fort for t2",
        trigger: [topics.t2Top, topics.t2Mid, topics.t2Bot],
        given: [t2FreeFortWarnedAlready],
        when: ([top, mid, bot], [warnedAlready]) =>
            !warnedAlready &&
            (top < TOWER_HEALTH_WARN_THRESHOLD ||
                mid < TOWER_HEALTH_WARN_THRESHOLD ||
                bot < TOWER_HEALTH_WARN_THRESHOLD),
        then: () => [
            new Fact(topics.configurableEffect, "free fort"),
            new Fact(t2FreeFortWarnedAlready, true),
        ],
    }),
    new Rule({
        label: "free fort for t3",
        trigger: [topics.t3Top, topics.t3Mid, topics.t3Bot],
        given: [t3FreeFortWarnedAlready],
        when: ([top, mid, bot], [warnedAlready]) =>
            !warnedAlready &&
            (top < TOWER_HEALTH_WARN_THRESHOLD ||
                mid < TOWER_HEALTH_WARN_THRESHOLD ||
                bot < TOWER_HEALTH_WARN_THRESHOLD),
        then: () => [
            new Fact(topics.configurableEffect, "free fort"),
            new Fact(t3FreeFortWarnedAlready, true),
        ],
    }),
]
    .map(inGame)
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
