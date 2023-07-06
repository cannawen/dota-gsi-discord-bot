import { DeepReadonly } from "ts-essentials";
import Fact from "../engine/Fact";
import GsiData from "./GsiData";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const minimapUnitsTopic =
    topicManager.createTopic<DeepReadonly<Set<string>>>("minimapUnitsTopic");
const allHeroesOnMinimapTopic = topicManager.createTopic<
    DeepReadonly<Set<string>>
>("allHeroesOnMinimapTopic");

const allHeroesInGameTopic = topicManager.createTopic<
    DeepReadonly<Set<string>>
>("allHeroesInGameTopic");

const friendlyCaptureTimeTopic = topicManager.createTopic<boolean>(
    "friendlyCaptureTimeTopic"
);
const enemyCaptureTimeTopic = topicManager.createTopic<boolean>(
    "enemyCaptureTimeTopic"
);

export default [
    new Rule({
        label: rules.gsi.minimap,
        trigger: [topics.allData],
        then: ([data]) => {
            const minimap = (data as GsiData).minimap;
            if (minimap) {
                return [
                    new Fact(
                        minimapUnitsTopic,
                        new Set(minimap.map((e) => e.unitname))
                    ),
                ];
            }
        },
    }),
    new Rule({
        label: "all heroes from minimap",
        trigger: [minimapUnitsTopic],
        then: ([units]) => {
            const heroes = [...units].filter((name) =>
                (name as string)?.match(/^npc_dota_hero/)
            );
            return new Fact(allHeroesOnMinimapTopic, new Set(heroes));
        },
    }),

    new Rule({
        label: "first five heroes on map",
        trigger: [allHeroesOnMinimapTopic],
        when: ([heroes]) => heroes.size === 5,
        then: () => new Fact(friendlyCaptureTimeTopic, true),
    }),
    new Rule({
        label: "first ten heroes on map",
        trigger: [allHeroesOnMinimapTopic],
        when: ([heroes]) => heroes.size === 10,
        then: () => new Fact(enemyCaptureTimeTopic, true),
    }),

    new Rule({
        label: "all friendly heroes",
        trigger: [friendlyCaptureTimeTopic],
        given: [allHeroesOnMinimapTopic],
        when: ([friendlyCapture]) => friendlyCapture,
        then: (_, [heroes]) => new Fact(topics.allFriendlyHeroes, heroes),
    }),
    new Rule({
        label: "all enemy heroes",
        trigger: [enemyCaptureTimeTopic],
        given: [allHeroesOnMinimapTopic, topics.allFriendlyHeroes],
        when: ([enemyCapture]) => enemyCapture,
        then: (_, [all, friendly]) =>
            new Fact(
                topics.allEnemyHeroes,
                new Set([...all].filter((hero) => !friendly.has(hero)))
            ),
    }),

    new Rule({
        label: "test minimap friendly",
        trigger: [topics.allFriendlyHeroes],
        then: ([heroes]) => {
            console.log("friendly heroes");
            console.log(heroes);
        },
    }),
    new Rule({
        label: "test minimap enemy",
        trigger: [topics.allEnemyHeroes],
        then: ([heroes]) => {
            console.log("enemy heroes");
            console.log(heroes);
        },
    }),
];
