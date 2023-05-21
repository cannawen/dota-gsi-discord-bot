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
    "Reminds you to pick up a neutral item (after 12:30) or to upgrade your neutral item if your current item is 2 tiers out of date",
    EffectConfig.PRIVATE
);

const TIME_BETWEEN_REMINDERS = 120;
const NEUTRAL_ITEM_REMINDER_START_TIME = 10 * 60 + 30;

export default [
    new Rule({
        label: rules.assistant.neutralItemReminder,
        trigger: [topics.items, topics.time],
        then: ([items]) => {
            const audio = items.neutral
                ? "you should upgrade your neutral item"
                : "you do not have a neutral item";
            // Remind them and update reminder time
            return [new Fact(topics.configurableEffect, audio)];
        },
    }),
]
    .map((rule) =>
        conditionalEveryIntervalSeconds(
            NEUTRAL_ITEM_REMINDER_START_TIME,
            undefined,
            ([items, time]) =>
                !helper.isItemAppropriateForTime(items.neutral?.id, time),
            TIME_BETWEEN_REMINDERS,
            rule
        )
    )
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
