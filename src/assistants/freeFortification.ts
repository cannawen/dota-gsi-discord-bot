import ConfigInfo from "../ConfigInfo";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import Topic from "../engine/Topic";
import topics from "../topics";
import inGame from "../engine/rules/inGame";
import configurable from "../engine/rules/configurable";

export const configInfo = new ConfigInfo(
    rules.assistant.freeFortification,
    "Free fortification",
    "Lets you know if it is a free fort when your tower is low (does not know if you actually have a fort available)",
    EffectConfig.PUBLIC_INTERRUPTING
);

const t1sAllUpTopic = new Topic<boolean>("t1sAllUpTopic");
const t2sAllUpTopic = new Topic<boolean>("t2sAllUpTopic");
const t3sAllUpTopic = new Topic<boolean>("t3sAllUpTopic");

export default [
    new Rule({
        label: "t1s all up",
        trigger: [topics.t1Top, topics.t1Mid, topics.t1Bot],
        then: ([top, mid, bot]) =>
            new Fact(t1sAllUpTopic, top[0] > 0 && mid[0] > 0 && bot[0] > 0),
    }),
    new Rule({
        label: "t2s all up",
        trigger: [topics.t2Top, topics.t2Mid, topics.t2Bot],
        then: ([top, mid, bot]) =>
            new Fact(t2sAllUpTopic, top[0] > 0 && mid[0] > 0 && bot[0] > 0),
    }),
    new Rule({
        label: "t3s all up",
        trigger: [topics.t3Top, topics.t3Mid, topics.t3Bot],
        then: ([top, mid, bot]) =>
            new Fact(t3sAllUpTopic, top[0] > 0 && mid[0] > 0 && bot[0] > 0),
    }),
]
    .map(inGame)
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
