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
    `Say "invoke 'spell name'" (i.e. tornado), and the bot will respond with the required orbs to invoke it (q w w)`,
    EffectConfig.PUBLIC
);

const keywords = ["invoke", "invoker", "info"];

const Q = "Q";
const W = "W";
const E = "E";

const invokerSpells: Array<[string[], string|string[]]> = [
    [[W, W, W], ["emp", "bmp"]],
    [[Q, W, W], "tornado"],
    [[W, W, E], "alacrity"],
    [[Q, Q, W], "ghost walk"],
    [[Q, W, E], "deafening (past|blast)"],
    [[W, E, E], ["chaos meteor", "meteor", "meatball", "chaos media"]],
    [[Q, Q, Q], ["cold snap", "code snap"]],
    [[Q, Q, E], "ice wall"],
    [[E, E, E], ["sun ?strike", "cataclysm", "send straight", "sunstroke", "some strike"]],
    [
        [Q, E, E],
        [
            "forge spirits?",
            "forest spirits?",
            "george spirits?",
            "ford? spirits?",
            "footsteps",
            "porch spirits",
        ],
    ]
];

export default invokerSpells
    .map(
        ([activeOrbs, regex]) =>
            new Rule({
                label: `invoker spell ${activeOrbs.join(" ")}`,
                trigger: [topics.lastDiscordUtterance],
                when: ([utterance]) => 
                    utterance.match(
                        new RegExp(
                            `^(${keywords.join("|")}) ((${
                                Array.isArray(regex) ? regex.join(")|(") : regex
                            }))$`,
                            "i"
                        )
                    ),
                then: () => activeOrbs.map(orb => new Fact(topics.configurableEffect, orb)),
            })
    )
    .map((rule) => configurable(configInfo.ruleIndentifier, rule));
