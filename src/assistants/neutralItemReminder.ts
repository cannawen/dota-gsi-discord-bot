import alive from "../engine/rules/alive";
import betweenSeconds from "../engine/rules/betweenSeconds";
import conditionalEveryIntervalSeconds from "../engine/rules/conditionalEveryIntervalSeconds";
import ConfigInfo from "../ConfigInfo";
import configurableRegularGame from "../engine/rules/configurableRegularGame";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import helper from "./helpers/neutralItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.neutralItemReminder,
    "Neutral item reminder",
    "Reminds you to pick up a neutral item (after 12:30) or to upgrade your neutral item if your current item is out of date",
    EffectConfig.PRIVATE
);

const TIME_BETWEEN_REMINDERS = 120;
const NEUTRAL_ITEM_REMINDER_START_TIME = 10 * 60 + 30;

export default [
    new Rule({
        label: "reminder to take or upgrade neutral item",
        trigger: [topics.items, topics.time],
        when: ([items, time]) =>
            !helper.isItemAppropriateForTime(items.neutral?.id, time),
        then: ([items]) => {
            const audio = items.neutral
                ? "you should upgrade your neutral item"
                : "you do not have a neutral item";
            return [new Fact(topics.configurableEffect, audio)];
        },
    }),
]
    .map((rule) =>
        conditionalEveryIntervalSeconds(TIME_BETWEEN_REMINDERS, rule)
    )
    .map((rule) =>
        betweenSeconds(NEUTRAL_ITEM_REMINDER_START_TIME, undefined, rule)
    )
    .map((rule) => configurableRegularGame(configInfo.ruleIndentifier, rule))
    .map(alive);
