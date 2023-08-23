import { DeepReadonly } from "ts-essentials";
import Fact from "../engine/Fact";
import GsiData from "./GsiData";
import MinimapElement from "../gsi-data-classes/MinimapElement";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const minimapUnitsTopic =
    topicManager.createTopic<DeepReadonly<Set<MinimapElement>>>(
        "minimapUnitsTopic"
    );

const allHeroesOnMinimapTopic = topicManager.createTopic<
    DeepReadonly<Set<string>>
>("allHeroesOnMinimapTopic");

const allTenHeroesOnMapForTheFirstTimeTopic = topicManager.createTopic<boolean>(
    "allTenHeroesOnMapForTheFirstTimeTopic"
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
                        new Set(minimap.map((e) => MinimapElement.create(e)))
                    ),
                ];
            }
        },
    }),
    new Rule({
        label: "all current heroes from minimap",
        trigger: [minimapUnitsTopic],
        then: ([elements]) => {
            const heroes = [...elements].filter((element) =>
                (element.unitName as string)?.match(/^npc_dota_hero/)
            );
            return new Fact(allHeroesOnMinimapTopic, new Set(heroes));
        },
    }),

    new Rule({
        label: "set state when we see ten heroes on map for the first time and 5 of them are dire",
        trigger: [allHeroesOnMinimapTopic],
        when: ([heroes]) =>
            heroes.size === 10 &&
            ([...heroes] as MinimapElement[]).filter(
                (hero) => hero.team === "dire"
            ).length === 5,
        then: () => new Fact(allTenHeroesOnMapForTheFirstTimeTopic, true),
    }),

    new Rule({
        label: "parse enemy and friendly heroes",
        trigger: [allTenHeroesOnMapForTheFirstTimeTopic],
        given: [allHeroesOnMinimapTopic, topics.team],
        when: ([allHeroesOnMap]) => allHeroesOnMap,
        then: (_, [heroes, myTeam]) => [
            new Fact(
                topics.allFriendlyHeroes,
                new Set(
                    ([...heroes] as MinimapElement[])
                        .filter((hero) => hero.team === myTeam)
                        .map((minimapElement) => minimapElement.unitName)
                )
            ),
            new Fact(
                topics.allEnemyHeroes,
                new Set(
                    ([...heroes] as MinimapElement[])
                        .filter((hero) => hero.team !== myTeam)
                        .map((minimapElement) => minimapElement.unitName)
                )
            ),
        ],
    }),
];
