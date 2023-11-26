import alive from "../engine/rules/alive";
import conditionalEveryIntervalSeconds from "../engine/rules/conditionalEveryIntervalSeconds";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.midas,
    "Midas",
    "Reminds you to use your midas if it has 2 charges",
    EffectConfig.PRIVATE
);

const REMINDER_INTERVAL_1_CHARGE = 30;
const REMINDER_INTERVAL_2_CHARGE = 15;

export default [
    conditionalEveryIntervalSeconds(
        REMINDER_INTERVAL_1_CHARGE,
        new Rule({
            label: "reminder to use midas (1 charge)",
            trigger: [topics.items],
            when: ([items]) =>
                items.findItem("item_hand_of_midas")?.charges === 1,
            then: () =>
                new Fact(
                    topics.configurableEffect,
                    "resources/audio/midas.mp3"
                ),
        })
    ),
    conditionalEveryIntervalSeconds(
        REMINDER_INTERVAL_2_CHARGE,
        new Rule({
            label: "reminder to use midas (2 charge)",
            trigger: [topics.items],
            when: ([items]) =>
                items.findItem("item_hand_of_midas")?.charges === 2,
            then: () =>
                new Fact(
                    topics.configurableEffect,
                    "resources/audio/midas.mp3"
                ),
        })
    ),
]
    .map(alive)
    .map(inGame)
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
