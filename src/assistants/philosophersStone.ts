/* eslint-disable max-statements */
import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import Topic from "../engine/Topic";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.philosophersStone
);
export const defaultConfig = EffectConfig.PRIVATE;

const seenPhilosophersStoneTopic = topicManager.createTopic<boolean>(
    "seenPhilosophersStoneTopic",
    { persistAcrossRestarts: true }
);
const remindedAlreadyThisDeathCycleTopic = topicManager.createTopic<boolean>(
    "remindedAlreadyThisDeathCycleTopic"
);

function seenPhilospherStoneForTheFirstTime(
    get: <T>(topic: Topic<T>) => T | undefined
): boolean {
    if (get(seenPhilosophersStoneTopic) === undefined) {
        const items = get(topics.items)!;
        const stone = [...items.backpack, ...items.stash, items.neutral]
            .filter((item) => item !== null)
            .find((item) => item!.id === "item_philosophers_stone");
        if (stone) {
            return true;
        }
    }
    return false;
}

export default new RuleConfigurable(
    rules.assistant.philosophersStone,
    configTopic,
    [topics.items, topics.inGame, topics.respawnSeconds, topics.alive],
    (get, effect) => {
        const inGame = get(topics.inGame)!;
        if (!inGame) return;

        if (seenPhilospherStoneForTheFirstTime(get)) {
            return new Fact(seenPhilosophersStoneTopic, true);
        }

        const seen = get(seenPhilosophersStoneTopic);
        if (seen === undefined) {
            return;
        }

        const alive = get(topics.alive)!;

        if (alive) {
            return new Fact(remindedAlreadyThisDeathCycleTopic, undefined);
        } else {
            const respawnSeconds = get(topics.respawnSeconds)!;
            const alreadyReminded = get(remindedAlreadyThisDeathCycleTopic);
            const items = get(topics.items)!;

            if (
                alreadyReminded === undefined &&
                items.neutral?.id !== "item_philosophers_stone"
            ) {
                return [
                    new Fact(
                        effect,
                        "resources/audio/philosphers-stone-hold.mp3"
                    ),
                    new Fact(remindedAlreadyThisDeathCycleTopic, true),
                ];
            }
            if (
                respawnSeconds === 5 &&
                items.neutral?.id === "item_philosophers_stone"
            ) {
                return new Fact(
                    effect,
                    "resources/audio/philosphers-stone-return.mp3"
                );
            }
        }
    }
);
