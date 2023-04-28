import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.goldReminder
);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription =
    "Reminds you to spend gold if you have too much";

const SMALL_REMINDER_INCREMENT = 500;
const LARGE_REMINDER_INCREMENT = 1000;

const lastRemindedGoldTopic = topicManager.createTopic<number>(
    "lastRemindedGoldTopic",
    {
        persistAcrossRestarts: true,
    }
);
// const remindGoldIncrementTopic = topicManager.createTopic<number>(
//     "remindGoldIncrementTopic"
// );
// const excessGoldTopic = topicManager.createTopic<number>("excessGoldTopic");
// const audioToPlayTopic = topicManager.createTopic<string>("audioToPlayTopic");

function newMultiplier(get: any) {
    return Math.floor(excessGold(get)! / warningIncrement(get));
}

function oldMultiplier(get: any) {
    return Math.floor(get(lastRemindedGoldTopic)! / warningIncrement(get));
}

function warningIncrement(get: any) {
    const time = get(topics.time)!;
    return time <= 10 * 60
        ? SMALL_REMINDER_INCREMENT
        : LARGE_REMINDER_INCREMENT;
}

function warningAudio(get: any) {
    const gold = excessGold(get)!;
    if (gold <= 1500) {
        return "resources/audio/gold.mp3";
    } else if (gold <= 2500) {
        return "you have a lot of gold";
    } else {
        return "you really have a lot of gold";
    }
}

function excessGold(get: any) {
    const time = get(topics.time)!;
    const gold = get(topics.gold)!;
    const buybackCooldown = get(topics.buybackCooldown)!;
    if (time >= 30 * 60 && buybackCooldown === 0) {
        return gold - get(topics.buybackCost);
    } else {
        return gold;
    }
}

export default [
    // new Rule(
    //     "when time is before 10:00, warn every 500 gold",
    //     [topics.time],
    //     () => {},
    //     ([time]) => time <= 10 * 60,
    //     () => new Fact(remindGoldIncrementTopic, SMALL_REMINDER_INCREMENT),
    //     [[remindGoldIncrementTopic, SMALL_REMINDER_INCREMENT]]
    // ),
    // new Rule(
    //     "when time is after 10:00, warn every 1000 gold",
    //     [topics.time],
    //     () => {},
    //     ([time]) => time > 10 * 60,
    //     () => new Fact(remindGoldIncrementTopic, LARGE_REMINDER_INCREMENT)
    // ),

    // new Rule(
    //     "when time is before 30:00, remind about all your gold",
    //     [topics.time, topics.gold],
    //     () => {},
    //     ([time]) => time < 30 * 60,
    //     ([_, gold]) => new Fact(excessGoldTopic, gold)
    // ),
    // new Rule(
    //     "when time is after 30:00, and you do not have buyback, remind about all your gold",
    //     [topics.time, topics.gold, topics.buybackCooldown],
    //     () => {},
    //     ([time, _, buybackCooldown]) => time >= 30 * 60 && buybackCooldown > 0,
    //     ([_, gold]) => new Fact(excessGoldTopic, gold)
    // ),
    // new Rule(
    //     "when time is after 30:00, and you have buyback, remind about your gold above buyback",
    //     [topics.time, topics.gold, topics.buybackCooldown],
    //     () => {},
    //     ([time, _, buybackCooldown]) =>
    //         time >= 30 * 60 && buybackCooldown === 0,
    //     ([_, gold], get) =>
    //         new Fact(excessGoldTopic, get(topics.buybackCost)! - gold)
    // ),

    // new Rule(
    //     "when you have under 1500 gold, play sound reminder",
    //     [topics.gold],
    //     () => {},
    //     ([gold]) => gold < 1500,
    //     () => new Fact(audioToPlayTopic, "resources/audio/gold.mp3")
    // ),
    // new Rule(
    //     "when you have under 2500 gold, play tts reminder",
    //     [topics.gold],
    //     () => {},
    //     ([gold]) => gold < 2500,
    //     () => new Fact(audioToPlayTopic, "you have a lot of gold")
    // ),
    // new Rule(
    //     "when you have over 2500 gold, play aggresive tts reminder",
    //     [topics.gold],
    //     () => {},
    //     ([gold]) => gold >= 2500,
    //     () => new Fact(audioToPlayTopic, "you really have a lot of gold")
    // ),

    new Rule(
        "if we have spent gold, update our gold topic",
        [topics.gold],
        () => {},
        (_, get) => oldMultiplier(get) > newMultiplier(get),
        ([gold]) => new Fact(lastRemindedGoldTopic, gold),
        [[lastRemindedGoldTopic, 0]]
    ),

    new Rule(
        "if we have passed a warning threshold, warn user.",
        [topics.gold],
        () => {},
        (_, get) => newMultiplier(get) > oldMultiplier(get),
        ([gold], get) => [
            new Fact(topics.configurableEffect, warningAudio(get)),
            new Fact(lastRemindedGoldTopic, gold),
        ]
    ),
]
    .map((rule) => new RuleDecoratorInGame(rule))
    .map((rule) => new RuleDecoratorConfigurable(configTopic, rule));
