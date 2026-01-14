import alive from "../engine/rules/alive";
import betweenSeconds from "../engine/rules/betweenSeconds";
import conditionalEveryIntervalSeconds from "../engine/rules/conditionalEveryIntervalSeconds";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import helper from "./helpers/neutralItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.neutralItemReminder,
    "Neutral item reminder",
    "Reminds you to get a neutral item (after 7:30)",
    EffectConfig.PRIVATE
);

const TIME_BETWEEN_REMINDERS = 120;
const NEUTRAL_ITEM_REMINDER_START_TIME = 5 * 60 + 30;

export default [
    new Rule({
        label: "reminder pick a neutral item",
        trigger: [topics.items],
        when: ([items]) => items.neutral?.id === undefined,
        then: ([_]) => {
            return [new Fact(topics.configurableEffect, "resources/audio/neutral.mp3")];
        },
    }),
]
    .map(alive)
    .map((rule) =>
        betweenSeconds(NEUTRAL_ITEM_REMINDER_START_TIME, undefined, rule)
    )
    .map((rule) =>
        conditionalEveryIntervalSeconds(TIME_BETWEEN_REMINDERS, rule)
    )
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
