import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import Topic from "../engine/Topic";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.goldReminder
);
export const defaultConfig = EffectConfig.PRIVATE;

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
    if (gold <= 1000) {
        fileName = "money";
    } else if (gold <= 2000) {
        fileName = "lot-of-money";
    } else {
        fileName = "really-lot-of-money";
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

export default new RuleConfigurable(
    rules.assistant.goldReminder,
    configTopic,
    [topics.gold, topics.inGame, topics.time],
    (get, effect) => {
        if (!get(topics.inGame)!) return;

        const time = get(topics.time)!;
        const gold = get(topics.gold)!;
        const lastRemindedGold = get(lastRemindedGoldTopic) || 0;

        if (time < 10 * 60) {
            return handle(
                gold,
                lastRemindedGold,
                SMALL_REMINDER_INCREMENT,
                effect
            );
        } else if (time < 30 * 60) {
            return handle(
                gold,
                lastRemindedGold,
                LARGE_REMINDER_INCREMENT,
                effect
            );
        } else {
            const buybackCost = get(topics.buybackCost)!;
            const buybackCooldown = get(topics.buybackCooldown)!;

            if (buybackCooldown === 0) {
                return handle(
                    gold - buybackCost,
                    lastRemindedGold,
                    LARGE_REMINDER_INCREMENT,
                    effect
                );
            } else {
                return handle(
                    gold,
                    lastRemindedGold,
                    LARGE_REMINDER_INCREMENT,
                    effect
                );
            }
        }
    }
);
