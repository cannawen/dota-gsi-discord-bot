import alive from "../engine/rules/alive";
import betweenSeconds from "../engine/rules/betweenSeconds";
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
    rules.assistant.checkEnemyInventory,
    "Check enemy inventory",
    "Reminds you to check enemy's inventory every 2 minutes or when you are dead",
    EffectConfig.NONE
);

const REMINDER_INTERVAL_SECONDS = 120;
const REMINDER_START_TIME = 15;
const REMINDER_STOP_TIME = 30 * 60;

export default [
    new Rule({
        label: "check enemy inventory",
        then: () =>
            new Fact(topics.configurableEffect, "check enemy inventory."),
    }),
]
    .map(alive)
    .map((rule) =>
        conditionalEveryIntervalSeconds(REMINDER_INTERVAL_SECONDS, rule)
    )
    .map((rule) =>
        betweenSeconds(REMINDER_START_TIME, REMINDER_STOP_TIME, rule)
    )
    .concat([
        new Rule({
            label: "check enemy inventory when dead",
            trigger: [topics.alive],
            when: (alive) => !alive,
            then: () =>
                new Fact(topics.configurableEffect, "check enemy inventory."),
        }),
    ])
    .map(inGame)
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
