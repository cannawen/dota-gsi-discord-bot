import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.joke,
    "Joke",
    `Responds to "tell me a joke"`,
    EffectConfig.PUBLIC
);

const JOKES = [
    "yo mama so fat, nightstalker is always flying",
    "yo mama so fat, snapfire ran out of cookies",
    "yo mama so fat, lifestealer infested her and couldn't find his way out",
    "yo mama so fat, she looks forward to invoker's meatball",
    "yo mama so fat, pudge is the second fattest hooker in the game",
    "yo mama so fat, she can't fit in the rosh pit",
    "yo mama so fat, when she blinks it causes an echoslam",
    "yo mama so fat, black hole doesn't effect her",
    "yo mama so fat, she it takes two force staffs to move her",
    "yo mama so fat, everybody builds phase boots",
    "yo mama so fat, when she gets chronosphered, void has to stand outside the chrono",
    "yo mama so fat, enemy scans are always red",
    "yo mama so fat, io can't relocate her",
    "yo mama so fat, sniper's headshot doesn't push her back",
    "yo mama so ugly, even axe refuses to call her",
    "your KDA",
];

export default [
    new Rule({
        label: `tells a joke in response to "tell me a joke"`,
        trigger: [topics.lastDiscordUtterance],
        when: ([utterance]) => utterance.match(/^tell me a joke$/i),
        then: () =>
            new Fact(
                topics.configurableEffect,
                JOKES[Math.floor(Math.random() * JOKES.length)]
            ),
    }),
].map((rule) => configurable(configInfo.ruleIndentifier, rule));
