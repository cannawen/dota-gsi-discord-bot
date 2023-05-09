import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import fs from "fs";
import path from "path";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.randomItem,
    "Random item suggestions",
    'Responds to discord command "What should I buy with x gold" or "What should I buy',
    EffectConfig.PUBLIC
);

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
        const match = message.match(
            /what (items? )?should I buy .*?([0-9,]+)/i
        );
        if (match === null) return;
        return parseInt(match[2].replace(/,/g, ""));
    } catch (_) {}
}

function whatShouldIBuy(message: string) {
    return message.match(/^what (items? )?(do|should) I (buy|get)$/i) !== null;
}

export default configurable(
    configInfo.ruleIndentifier,
    new Rule({
        label: rules.assistant.glhf,
        trigger: [topics.lastDiscordUtterance],
        then: ([message]) => {
            if (whatShouldIBuy(message)) {
                const randomIndex = Math.floor(
                    Math.random() * itemCosts.length
                );
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
        },
    })
);
