/* eslint-disable max-statements */
import { DeepReadonly } from "ts-essentials";
import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
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

function hasPhilosophersStone(items: DeepReadonly<PlayerItems>): boolean {
    const stone = [...items.backpack, ...items.stash, items.neutral]
        .filter((item) => item !== null)
        .find((item) => item!.id === "item_philosophers_stone");
    return stone !== undefined;
}

export default new RuleDecoratorInGame(
    new RuleConfigurable(
        rules.assistant.philosophersStone,
        configTopic,
        [topics.items, topics.respawnSeconds, topics.alive],
        (get, effect) => {
            const items = get(topics.items)!;

            const seenBefore = get(seenPhilosophersStoneTopic);
            if (seenBefore === undefined && hasPhilosophersStone(items)) {
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
                            "resources/audio/philosophers-stone-hold.mp3"
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
                        "resources/audio/philosophers-stone-return.mp3"
                    );
                }
            }
        }
    )
);
