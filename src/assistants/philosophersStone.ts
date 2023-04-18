/* eslint-disable max-statements */
import { DeepReadonly } from "ts-essentials";
import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import log from "../log";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
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

function hasPhilosophersStone(items: DeepReadonly<PlayerItems>): boolean {
    const stone = [...items.backpack, ...items.stash, items.neutral]
        .filter((item) => item !== null)
        .find((item) => item!.id === "item_philosophers_stone");
    return stone !== undefined;
}

export default new RuleConfigurable(
    rules.assistant.philosophersStone,
    configTopic,
    [topics.items, topics.inGame, topics.respawnSeconds, topics.alive],
    (get, effect) => {
        const inGame = get(topics.inGame)!;
        if (!inGame) return;
        const items = get(topics.items)!;

        const seenBefore = get(seenPhilosophersStoneTopic);
        if (seenBefore === undefined && hasPhilosophersStone(items)) {
            // TODO remove
            log.info("rules", "Found philosopher's stone");
            return new Fact(seenPhilosophersStoneTopic, true);
        }
        if (!seenBefore) {
            return;
        }

        const alive = get(topics.alive)!;

        if (alive) {
            return new Fact(remindedAlreadyThisDeathCycleTopic, undefined);
        } else {
            const respawnSeconds = get(topics.respawnSeconds)!;
            const alreadyReminded = get(remindedAlreadyThisDeathCycleTopic);

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
