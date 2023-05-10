import betweenSeconds from "../engine/rules/betweenSeconds";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.goldReminder,
    "Gold reminder",
    "Reminds you to spend gold if you have too much",
    EffectConfig.PRIVATE
);

const GOLD_REMINDER_INCREMENT_CHANGE_TIME = 10 * 60;
const GOLD_REMINDER_CARE_ABOUT_BUYBACK_TIME = 30 * 60;

/**
 * When the user interacts with gold by
 * 1) Spending it, or
 * 2) Having us remind them anout it
 * Set the lastReminderGoldTopic to the amount of gold that the interaction was at
 */
const lastRemindedGoldTopic = topicManager.createTopic<number>(
    "lastRemindedGoldTopic",
    { defaultValue: 0 }
);
/**
 * How often should we remind the user about their excess gold?
 * Once every 500 gold before 10 minutes, once every 1000 gold afterwards
 */
const remindGoldIncrementTopic = topicManager.createTopic<number>(
    "remindGoldIncrementTopic"
);
/**
 * How much discretionary gold is the user holding onto?
 * (Buyback cost is considered non-discretionary after 30:00)
 */
const discretionaryGoldTopic = topicManager.createTopic<number>(
    "discretionaryGoldTopic"
);
/**
 * What reminder audio string do we want to play
 */
const audioToPlayTopic = topicManager.createTopic<string>("audioToPlayTopic");

function multiplier(gold: number, increment: number) {
    return Math.floor(gold / increment);
}

export default [
    // Store reminder increment
    betweenSeconds(
        0,
        GOLD_REMINDER_INCREMENT_CHANGE_TIME,
        new Rule({
            label: "when time is before 10:00, set reminder increment to 500 gold",
            then: () => new Fact(remindGoldIncrementTopic, 500),
        })
    ),
    betweenSeconds(
        GOLD_REMINDER_INCREMENT_CHANGE_TIME,
        undefined,
        new Rule({
            label: "when time is after 10:00, set reminder increment to 1000 gold",
            then: () => new Fact(remindGoldIncrementTopic, 1000),
        })
    ),
    // Store excess gold
    betweenSeconds(
        0,
        GOLD_REMINDER_CARE_ABOUT_BUYBACK_TIME,
        new Rule({
            label: "when time is before 30:00, you can spend all your gold",
            trigger: [topics.gold],
            then: ([gold]) => new Fact(discretionaryGoldTopic, gold),
        })
    ),
    betweenSeconds(
        GOLD_REMINDER_CARE_ABOUT_BUYBACK_TIME,
        undefined,
        new Rule({
            label: "when time is after 30:00, and you do not have buyback, you can spend all your gold",
            trigger: [topics.gold, topics.buybackCooldown],
            when: ([_, buybackCooldown]) => buybackCooldown > 0,
            then: ([gold]) => new Fact(discretionaryGoldTopic, gold),
        })
    ),
    betweenSeconds(
        GOLD_REMINDER_CARE_ABOUT_BUYBACK_TIME,
        undefined,
        new Rule({
            label: "when time is after 30:00, and you have buyback cooldown available, you can spend your gold above buyback",
            trigger: [topics.gold, topics.buybackCooldown],
            given: [topics.buybackCost],
            when: ([_, cooldown]) => cooldown === 0,
            then: ([gold], [buybackCost]) =>
                new Fact(
                    discretionaryGoldTopic,
                    Math.max(0, gold - buybackCost)
                ),
        })
    ),
    // Store audio string
    new Rule({
        label: "when you have 1500 gold or less, use mild reminder",
        trigger: [discretionaryGoldTopic],
        when: ([gold]) => gold <= 1500,
        then: () => new Fact(audioToPlayTopic, "resources/audio/gold.mp3"),
    }),
    new Rule({
        label: "when you have 1501-2500 gold, use tts reminder",
        trigger: [discretionaryGoldTopic],
        when: ([gold]) => gold > 1500 && gold <= 2500,
        then: () => new Fact(audioToPlayTopic, "you have a lot of gold"),
    }),
    new Rule({
        label: "when you have over 2500-3500 gold, use aggresive tts reminder",
        trigger: [discretionaryGoldTopic],
        when: ([gold]) => gold > 2500 && gold <= 3500,
        then: () => new Fact(audioToPlayTopic, "you really have a lot of gold"),
    }),
    new Rule({
        label: "when you have over 3500 gold, use super aggresive tts reminder",
        trigger: [discretionaryGoldTopic],
        when: ([gold]) => gold > 3500,
        then: () =>
            new Fact(
                audioToPlayTopic,
                "you have an insane amount of gold. please stop what you are doing and spend it now"
            ),
    }),
    new Rule({
        label: "after we spend gold past a multiplier threshold, save the new gold amount as our new baseline to check against",
        trigger: [discretionaryGoldTopic],
        given: [lastRemindedGoldTopic, remindGoldIncrementTopic],
        when: ([discretionaryGold], [lastRemindedGold, increment]) =>
            multiplier(lastRemindedGold, increment) >
            multiplier(discretionaryGold, increment),
        then: ([gold]) => new Fact(lastRemindedGoldTopic, gold),
    }),
    configurable(
        configInfo.ruleIndentifier,
        new Rule({
            label: "If we increase gold past a multiplier threshold, save the gold amount and warn the user",
            trigger: [discretionaryGoldTopic, audioToPlayTopic],
            given: [lastRemindedGoldTopic, remindGoldIncrementTopic],
            when: ([discretionaryGold], [lastRemindedGold, increment]) =>
                multiplier(discretionaryGold, increment) >
                multiplier(lastRemindedGold, increment),
            then: ([gold, audioToPlay]) => [
                new Fact(topics.configurableEffect, audioToPlay),
                new Fact(lastRemindedGoldTopic, gold),
            ],
        })
    ),
].map(inGame);
