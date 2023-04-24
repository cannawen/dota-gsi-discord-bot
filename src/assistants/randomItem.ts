import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import fs from "fs";
import path from "path";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.randomItem
);
export const defaultConfig = EffectConfig.PUBLIC;
export const assistantDescription =
    'Responds to discord command "What should I buy with x gold"';

// [["Observer Ward", 0], ["Sentry Ward", 50], ...]
const itemCosts: Array<[string, number]> = Object.entries(
    JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../../resources/itemCosts.json"),
            "utf8"
        )
    )
);

function randomItemCost(message: string) {
    try {
        const match = message.match(/what should I buy .*?([0-9,]+)/i);
        if (match === null) return;
        return parseInt(match[1].replace(/,/g, ""));
    } catch (_) {}
}

function whatShouldIBuy(message: string) {
    return message.match(/^what (do|should) I (buy|get)$/i) !== null;
}

export default new RuleDecoratorConfigurable(
    configTopic,
    new Rule(rules.assistant.glhf, [topics.lastDiscordUtterance], (get) => {
        const message = get(topics.lastDiscordUtterance)!;
        if (whatShouldIBuy(message)) {
            const randomIndex = Math.floor(Math.random() * itemCosts.length);
            return new Fact(
                topics.configurableEffect,
                `Buy a ${itemCosts[randomIndex][0]}`
            );
        }
        const cost = randomItemCost(message);
        if (cost === undefined) {
            return;
        }
        const sortedItems = itemCosts.sort(
            ([_nameA, costA], [_nameB, costB]) =>
                Math.abs(costA - cost) - Math.abs(costB - cost)
        );
        const closestItems = sortedItems.slice(0, 10);
        const randomIndex = Math.floor(Math.random() * closestItems.length);
        return new Fact(
            topics.configurableEffect,
            `Buy a ${closestItems[randomIndex][0]}`
        );
    })
);
