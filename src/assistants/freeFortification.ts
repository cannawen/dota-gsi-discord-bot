import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import Topic from "../engine/Topic";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.freeFortification,
    "Free fortification",
    "Lets you know if it is a free fort when your tower is low (does not know if you actually have a fort available). Note: requires v2 of GSI .cfg file to work, use /config to download your new GSI file",
    EffectConfig.PUBLIC_INTERRUPTING
);

const TOWER_HEALTH_WARN_THRESHOLD = 150;

const t1sAllUpTopic = new Topic<boolean>("t1sAllUpTopic");
const t2sAllUpTopic = new Topic<boolean>("t2sAllUpTopic");
const t3sAllUpTopic = new Topic<boolean>("t3sAllUpTopic");

const t1FreeFortWarnedAlready = new Topic<boolean>("t1FreeFortWarnedAlready");
const t2FreeFortWarnedAlready = new Topic<boolean>("t2FreeFortWarnedAlready");
const t3FreeFortWarnedAlready = new Topic<boolean>("t3FreeFortWarnedAlready");

export default [
    new Rule({
        label: "t1s all up",
        trigger: [topics.t1Top, topics.t1Mid, topics.t1Bot],
        then: ([top, mid, bot]) =>
            new Fact(t1sAllUpTopic, top > 0 && mid > 0 && bot > 0),
    }),
    new Rule({
        label: "t2s all up",
        trigger: [topics.t2Top, topics.t2Mid, topics.t2Bot],
        then: ([top, mid, bot]) =>
            new Fact(t2sAllUpTopic, top > 0 && mid > 0 && bot > 0),
    }),
    new Rule({
        label: "t3s all up",
        trigger: [topics.t3Top, topics.t3Mid, topics.t3Bot],
        then: ([top, mid, bot]) =>
            new Fact(t3sAllUpTopic, top > 0 && mid > 0 && bot > 0),
    }),
    new Rule({
        label: "free fort for t1",
        trigger: [
            topics.t1Top,
            topics.t1Mid,
            topics.t1Bot,
            t1sAllUpTopic,
            t1FreeFortWarnedAlready,
        ],
        when: ([top, mid, bot, free, warnedAlready]) =>
            !warnedAlready &&
            free &&
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
        trigger: [
            topics.t2Top,
            topics.t2Mid,
            topics.t2Bot,
            t2sAllUpTopic,
            t2FreeFortWarnedAlready,
        ],
        when: ([top, mid, bot, free, warnedAlready]) =>
            !warnedAlready &&
            free &&
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
        trigger: [
            topics.t3Top,
            topics.t3Mid,
            topics.t3Bot,
            t3sAllUpTopic,
            t3FreeFortWarnedAlready,
        ],
        when: ([top, mid, bot, free, warnedAlready]) =>
            !warnedAlready &&
            free &&
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
