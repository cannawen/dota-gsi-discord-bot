/* eslint-disable max-classes-per-file */
import Config from "../configTopics";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import Topic from "../engine/Topic";
import topics from "../topics";

export const configTopic = new Topic<Config>(
    rules.assistant.goldReminder,
    true
);
export const defaultConfig = Config.PRIVATE;

const SMALL_REMINDER_INCREMENT = 500;
const LARGE_REMINDER_INCREMENT = 1000;

const lastGoldMultiplierTopic = new Topic<number>("lastGoldMultiplierTopic");

function handlePre10Minute(
    gold: number,
    oldMultiplier: number,
    effect: Topic<string>
) {
    const newMultiplier = Math.floor(gold / SMALL_REMINDER_INCREMENT);

    if (newMultiplier > oldMultiplier) {
        return [
            new Fact(effect, `resources/audio/money.mp3`),
            new Fact(lastGoldMultiplierTopic, newMultiplier),
        ];
    } else if (oldMultiplier > newMultiplier) {
        return new Fact(lastGoldMultiplierTopic, newMultiplier);
    }
}

function handle10To30Minute(
    gold: number,
    oldMultiplier: number,
    effect: Topic<string>
) {
    const newMultiplier = Math.floor(gold / LARGE_REMINDER_INCREMENT);
    if (newMultiplier > oldMultiplier) {
        return [
            new Fact(effect, `resources/audio/money.mp3`),
            new Fact(lastGoldMultiplierTopic, newMultiplier),
        ];
    } else if (oldMultiplier > newMultiplier) {
        return new Fact(lastGoldMultiplierTopic, newMultiplier);
    }
}

function handle30PlusMinutes(
    gold: number,
    oldMultiplier: number,
    effect: Topic<string>,
    buybackCost: number,
    buybackCooldown: number
) {
    if (buybackCooldown === 0) {
        const usableGold = gold - buybackCost;
        return handle10To30Minute(usableGold, oldMultiplier, effect);
    } else {
        return handle10To30Minute(gold, oldMultiplier, effect);
    }
}

// TODO refactor to use last gold reminded on instead of multiplier
export default new RuleConfigurable(
    rules.assistant.goldReminder,
    configTopic,
    [topics.gold, topics.inGame, topics.time],
    (get, effect) => {
        if (!get(topics.inGame)!) return;

        const time = get(topics.time)!;
        const gold = get(topics.gold)!;
        const oldMultiplier = get(lastGoldMultiplierTopic) || 0;

        if (time === 10 * 60) {
            const scaledMultiplier = Math.floor(
                oldMultiplier /
                    (LARGE_REMINDER_INCREMENT / SMALL_REMINDER_INCREMENT)
            );
            return new Fact(lastGoldMultiplierTopic, scaledMultiplier);
        }

        if (time < 10 * 60) {
            return handlePre10Minute(gold, oldMultiplier, effect);
        } else if (time < 30 * 60) {
            return handle10To30Minute(gold, oldMultiplier, effect);
        } else {
            return handle30PlusMinutes(
                gold,
                oldMultiplier,
                effect,
                get(topics.buybackCost)!,
                get(topics.buybackCooldown)!
            );
        }
    }
);
