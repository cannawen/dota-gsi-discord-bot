/* eslint-disable max-statements */
import { DeepReadonly } from "ts-essentials";
import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import RuleDecoratorConfigurable from "../engine/RuleDecoratorConfigurable";
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
        .find((item) => item!.id === helper.neutral.item.philosophersStone);
    return stone !== undefined;
}

export default new RuleDecoratorInGame(
    new RuleDecoratorConfigurable(
        configTopic,
        new Rule({
            label: rules.assistant.philosophersStone,
            trigger: [topics.items, topics.alive, topics.respawnSeconds],
            given: [
                seenPhilosophersStoneTopic,
                remindedAlreadyThisDeathCycleTopic,
            ],
            then: (
                [items, alive, respawnSeconds],
                [seenBefore, alreadyReminded]
            ) => {
                if (seenBefore === undefined && hasPhilosophersStone(items)) {
                    return new Fact(seenPhilosophersStoneTopic, true);
                }
                if (!seenBefore) {
                    return;
                }

                if (alive) {
                    return new Fact(
                        remindedAlreadyThisDeathCycleTopic,
                        undefined
                    );
                } else {
                    if (
                        alreadyReminded === undefined &&
                        items.neutral?.id !== "item_philosophers_stone"
                    ) {
                        return [
                            new Fact(
                                topics.configurableEffect,
                                "you can hold the philosopher's stone"
                            ),
                            new Fact(remindedAlreadyThisDeathCycleTopic, true),
                        ];
                    }
                    if (
                        respawnSeconds === 5 &&
                        items.neutral?.id === "item_philosophers_stone"
                    ) {
                        return new Fact(
                            topics.configurableEffect,
                            "you can return the philosopher's stone"
                        );
                    }
                }
            },
        })
    )
);
