import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import RuleDecoratorStartAndEndMinute from "../engine/RuleDecoratorStartAndEndMinute";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.goldReminder
);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription =
    "Reminds you to spend gold if you have too much";

/**
 * When the user interacts with gold by
 * 1) Spending it, or
 * 2) Having us remind them anout it
 * Set the lastReminderGoldTopic to the amount of gold that the interaction was at
 */
const lastRemindedGoldTopic = topicManager.createTopic<number>(
    "lastRemindedGoldTopic"
);
/**
 * How often should we remind the user about their excess gold?
 * Once every 500 gold before 10 minutes, once every 1000 gold afterwards
 */
const remindGoldIncrementTopic = topicManager.createTopic<number>(
    "remindGoldIncrementTopic"
);
/**
 * How much "extra" gold does is the user holding onto?
 * (Takes buyback into account after 30:00)
 */
const excessGoldTopic = topicManager.createTopic<number>("excessGoldTopic");
/**
 * What reminder audio string do we want to play
 */
const audioToPlayTopic = topicManager.createTopic<string>("audioToPlayTopic");

function newMultiplier(get: any) {
    const gold = get(excessGoldTopic)!;
    const increment = get(remindGoldIncrementTopic)!;
    return Math.floor(gold / increment);
}

function oldMultiplier(get: any) {
    const gold = get(lastRemindedGoldTopic)!;
    const increment = get(remindGoldIncrementTopic)!;
    return Math.floor(gold / increment);
}

export default [
    // Store reminder increment
    new RuleDecoratorStartAndEndMinute(
        0,
        10,
        new Rule(
            "when time is before 10:00, warn every 500 gold",
            [topics.time],
            () => {},
            () => true,
            () => new Fact(remindGoldIncrementTopic, 500)
        )
    ),
    new RuleDecoratorStartAndEndMinute(
        10,
        undefined,
        new Rule(
            "when time is after 10:00, warn every 1000 gold",
            [topics.time],
            () => {},
            () => true,
            () => new Fact(remindGoldIncrementTopic, 1000)
        )
    ),
    // Store excess gold
    new RuleDecoratorStartAndEndMinute(
        0,
        30,
        new Rule(
            "when time is before 30:00, remind about all your gold",
            [topics.gold, topics.time],
            () => {},
            () => true,
            ([gold]) => new Fact(excessGoldTopic, gold)
        )
    ),
    new RuleDecoratorStartAndEndMinute(
        30,
        undefined,
        new Rule(
            "when time is after 30:00, and you do not have buyback, remind about all your gold",
            [topics.gold, topics.buybackCooldown, topics.time],
            () => {},
            ([_, buybackCooldown]) => buybackCooldown > 0,
            ([gold]) => new Fact(excessGoldTopic, gold)
        )
    ),
    new RuleDecoratorStartAndEndMinute(
        30,
        undefined,
        new Rule(
            "when time is after 30:00, and you have buyback, remind about your gold above buyback",
            [topics.gold, topics.buybackCooldown, topics.time],
            () => {},
            ([_, buybackCooldown]) => buybackCooldown === 0,
            ([gold], get) =>
                new Fact(
                    excessGoldTopic,
                    Math.max(0, gold - get(topics.buybackCost)!)
                )
        )
    ),
    // Store audio string
    new Rule(
        "when you have under 1500 gold, play sound reminder",
        [excessGoldTopic],
        () => {},
        ([gold]) => gold <= 1500,
        () => new Fact(audioToPlayTopic, "resources/audio/gold.mp3")
    ),
    new Rule(
        "when you have 1500-2500 gold, play tts reminder",
        [excessGoldTopic],
        () => {},
        ([gold]) => gold > 1500 && gold <= 2500,
        () => new Fact(audioToPlayTopic, "you have a lot of gold")
    ),
    new Rule(
        "when you have over 2500 gold, play aggresive tts reminder",
        [excessGoldTopic],
        () => {},
        ([gold]) => gold > 2500,
        () => new Fact(audioToPlayTopic, "you really have a lot of gold")
    ),
    // After we spend gold past a multiplier threshold, save the new gold amount as our new baseline to check against
    new Rule(
        "if we have spent gold, update our gold topic",
        [excessGoldTopic],
        () => {},
        (_, get) => oldMultiplier(get) > newMultiplier(get),
        ([gold]) => new Fact(lastRemindedGoldTopic, gold),
        [[lastRemindedGoldTopic, 0]]
    ),
    // If we increase gold past a multiplier threshold, save the gold amount and warn the user
    new RuleDecoratorConfigurable(
        configTopic,
        new Rule(
            "if we have passed a warning threshold, warn user and update our gold topic",
            [excessGoldTopic, audioToPlayTopic],
            () => {},
            (_, get) => newMultiplier(get) > oldMultiplier(get),
            ([gold], get) => [
                new Fact(topics.configurableEffect, get(audioToPlayTopic)!),
                new Fact(lastRemindedGoldTopic, gold),
            ]
        )
    ),
].map((rule) => new RuleDecoratorInGame(rule));
