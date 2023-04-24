import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import rules from "../rules";
import Topic from "../engine/Topic";
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

function handle(
    gold: number,
    lastRemindedGold: number,
    reminderIncrement: number,
    effect: Topic<string>
) {
    const newMultiplier = Math.floor(gold / reminderIncrement);
    const oldMultiplier = Math.floor(lastRemindedGold / reminderIncrement);

    let fileName: string;
    if (gold <= 1500) {
        fileName = "gold";
    } else if (gold <= 2500) {
        fileName = "gold-lots";
    } else {
        fileName = "gold-lots-really";
    }

    if (newMultiplier > oldMultiplier) {
        return [
            new Fact(effect, `resources/audio/${fileName}.mp3`),
            new Fact(lastRemindedGoldTopic, gold),
        ];
    } else if (oldMultiplier > newMultiplier) {
        return new Fact(lastRemindedGoldTopic, gold);
    }
}

export default new RuleDecoratorInGame(
    new RuleDecoratorConfigurable(
        configTopic,
        new Rule(
            rules.assistant.goldReminder,
            [topics.gold, topics.time],
            (get) => {
                const time = get(topics.time)!;
                const gold = get(topics.gold)!;
                const lastRemindedGold = get(lastRemindedGoldTopic) || 0;

                let excessGold = gold;

                if (time >= 30 * 60) {
                    const buybackCost = get(topics.buybackCost)!;
                    const buybackCooldown = get(topics.buybackCooldown)!;

                    if (buybackCooldown === 0) {
                        excessGold = gold - buybackCost;
                    }
                }
                return handle(
                    excessGold,
                    lastRemindedGold,
                    time < 10 * 60
                        ? SMALL_REMINDER_INCREMENT
                        : LARGE_REMINDER_INCREMENT,
                    topics.configurableEffect
                );
            }
        )
    )
);
