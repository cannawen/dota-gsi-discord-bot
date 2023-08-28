/* eslint-disable max-statements */
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import helper from "./helpers/neutralItems";
import inGame from "../engine/rules/inGame";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.philosophersStone,
    "Philosopher's stone",
    "Reminds you to use Philosopher's Stone while you are dead",
    EffectConfig.PRIVATE
);

const seenPhilosophersStoneTopic = topicManager.createTopic<boolean>(
    "seenPhilosophersStoneTopic",
    { defaultValue: false, persistAcrossRestarts: true }
);
const remindedAlreadyThisDeathCycleTopic = topicManager.createTopic<boolean>(
    "remindedAlreadyThisDeathCycleTopic"
);

function holdingPhilosophersStone(items: PlayerItems): boolean {
    return items.neutral?.id === "item_philosophers_stone";
}

export default [
    new Rule({
        label: "set state that we have seen a philosopher's stone before",
        trigger: [topics.items],
        when: ([items]) =>
            items.findItem("item_philosophers_stone") !== undefined,
        then: () => new Fact(seenPhilosophersStoneTopic, true),
    }),
    new Rule({
        label: "tell you to take the philosopher's stone while you are dead",
        trigger: [topics.alive],
        given: [
            seenPhilosophersStoneTopic,
            topics.items,
            remindedAlreadyThisDeathCycleTopic,
        ],
        when: ([alive], [seenBefore, items, alreadyReminded]) =>
            !alive &&
            seenBefore &&
            !alreadyReminded &&
            !holdingPhilosophersStone(items),
        then: () => [
            new Fact(
                topics.configurableEffect,
                "you can hold the philosopher's stone"
            ),
            new Fact(remindedAlreadyThisDeathCycleTopic, true),
        ],
    }),
    new Rule({
        label: "reset death cycle reminder when you are alive",
        trigger: [topics.alive],
        when: ([alive]) => alive,
        then: () => new Fact(remindedAlreadyThisDeathCycleTopic, undefined),
    }),
    new Rule({
        label: "reminder to return the philosopher's stone",
        trigger: [topics.respawnSeconds],
        given: [topics.items, topics.time],
        when: ([respawn], [items, time]) =>
            respawn === 5 &&
            holdingPhilosophersStone(items) &&
            !helper.isItemAppropriateForTime(items.neutral.id, time),
        then: () =>
            new Fact(
                topics.configurableEffect,
                "you can return the philosopher's stone"
            ),
    }),
]
    .map((rule) => configurable(configInfo.ruleIndentifier, rule))
    .map(inGame);
