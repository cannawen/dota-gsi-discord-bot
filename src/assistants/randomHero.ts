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
    rules.assistant.randomHero,
    "Random hero",
    'Responds with a random hero when you say "random hero"',
    EffectConfig.PUBLIC
);


const tagAndName: Array<[string, string]> = Object.entries(
        JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../../resources/heroes.json"),
                "utf8"
            )
        )
    );
const tagToName: Map<string, string> =new Map(tagAndName);


function randomHeroName(): string {
    const randomIndex = Math.floor(Math.random() * tagToName.size);
    return Array.from(tagToName.values())[randomIndex]
}

export default [
    new Rule({
        label: "ask a question",
        trigger: [topics.lastDiscordUtterance],
        then: ([message]) => {
            if ((message as string).match(/^(Brandon|random) hero$/i)) {
                return new Fact(topics.configurableEffect, randomHeroName())
            }
        }
    })
]
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
