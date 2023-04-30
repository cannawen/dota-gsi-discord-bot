/* eslint-disable max-statements */
import configurable from "../engine/rules/configurable";
import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
import inGame from "../engine/rules/inGame";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.philosophersStone
);
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription =
    "Reminds you to use Philosopher's Stone while you are dead";

const seenPhilosophersStoneTopic = topicManager.createTopic<boolean>(
    "seenPhilosophersStoneTopic",
    { persistAcrossRestarts: true }
);
const remindedAlreadyThisDeathCycleTopic = topicManager.createTopic<boolean>(
    "remindedAlreadyThisDeathCycleTopic"
);

function hasPhilosophersStone(items: PlayerItems): boolean {
    const stone = [...items.backpack, ...items.stash, items.neutral]
        .filter((item) => item !== null)
        .find((item) => item!.id === helper.neutral.item.philosophersStone);
    return stone !== undefined;
}

function holdingPhilosophersStone(items: PlayerItems): boolean {
    return items.neutral?.id === helper.neutral.item.philosophersStone;
}

export default [
    new Rule({
        label: "set state that we have seen a philosopher's stone before",
        trigger: [topics.items],
        when: ([items]) => hasPhilosophersStone(items),
        then: () => new Fact(seenPhilosophersStoneTopic, true),
        defaultValues: [new Fact(seenPhilosophersStoneTopic, false)],
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
            !helper.neutral.isItemAppropriateForTime(items.neutral.id, time),
        then: () =>
            new Fact(
                topics.configurableEffect,
                "you can return the philosopher's stone"
            ),
    }),
]
    .map((rule) => configurable(configTopic, rule))
    .map(inGame);
