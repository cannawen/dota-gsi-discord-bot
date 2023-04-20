import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import fs from "fs";
import path from "path";
import RuleConfigurable from "../engine/RuleConfigurable";
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
        const match = message.match(/what should I buy .*([0-9,]+)/i);
        if (match === null) return;
        return parseInt(match[1].replace(/,/g, ""));
    } catch (_) {}
}

export default new RuleConfigurable(
    rules.assistant.glhf,
    configTopic,
    [topics.lastDiscordUtterance],
    (get, effect) => {
        const message = get(topics.lastDiscordUtterance)!;
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
        return new Fact(effect, `Buy a ${closestItems[randomIndex][0]}`);
    }
);
