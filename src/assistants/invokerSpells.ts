import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.invoker,
    "Invoker voice commands",
    `Say "invoke <spell name>", and the bot will respond with the required orbs to invoke it`,
    EffectConfig.NONE
);

const keywords = ["invoke", "invoker", "info"];

export default [
    ["w w w", ["emp", "bmp"]],
    ["q w w", "tornado"],
    ["w w e", "alacrity"],
    ["q q w", "ghost walk"],
    ["q w e", "deafening blast"],
    ["w! e! e", ["chaos meteor", "meteor"]],
    ["q q q", ["cold snap", "code snap"]],
    ["q q e", "ice wall"],
    [
        "q! e! e",
        [
            "forge spirits?",
            "forest spirits?",
            "george spirits?",
            "ford spirits?",
            "footsteps",
            "porch spirits",
        ],
    ],
    ["e! e! e", ["sun strike", "cataclysm", "send straight", "sunstroke"]],
]
    .map(
        ([activeOrbs, regex]) =>
            new Rule({
                label: `invoker spell ${activeOrbs}`,
                trigger: [topics.lastDiscordUtterance],
                when: ([utterance]) =>
                    utterance.match(
                        new RegExp(
                            `^((${keywords.join("|")}) ${
                                Array.isArray(regex) ? regex.join(")|(") : regex
                            })$`,
                            "i"
                        )
                    ),
                then: () => new Fact(topics.configurableEffect, activeOrbs),
            })
    )
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
