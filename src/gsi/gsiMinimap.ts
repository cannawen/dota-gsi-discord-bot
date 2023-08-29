import Fact from "../engine/Fact";
import GsiData from "./GsiData";
import MinimapElement from "../gsi-data-classes/MinimapElement";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const minimapUnitsTopic =
    topicManager.createTopic<MinimapElement[]>("minimapUnitsTopic");

const allHeroesOnMinimapTopic = topicManager.createTopic<MinimapElement[]>(
    "allHeroesOnMinimapTopic"
);

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
                        minimap.map((e) => MinimapElement.create(e))
                    ),
                ];
            }
        },
    }),
    new Rule({
        label: "all unique current heroes from minimap",
        trigger: [minimapUnitsTopic],
        then: ([elements]) => {
            // We get multiple of the same hero from minimap GSI data
            // So not sure how to determine which x/y location is "correct"
            // See https://github.com/cannawen/dota-gsi-discord-bot/issues/135 for details
            const heroes = (elements as MinimapElement[])
                .filter((element) =>
                    (element.unitName as string)?.match(/^npc_dota_hero/)
                )
                .reduce((memo, hero) => {
                    const heroAlreadyExists = memo.find(
                        (memoHero) => memoHero.unitName === hero.unitName
                    );
                    if (!heroAlreadyExists) {
                        memo.push(hero);
                    }
                    return memo;
                }, [] as MinimapElement[]);
            return new Fact(allHeroesOnMinimapTopic, heroes);
        },
    }),

    new Rule({
        label: "set state when we see ten heroes on map for the first time and 5 of them are dire",
        trigger: [allHeroesOnMinimapTopic],
        when: ([heroes]) =>
            heroes.length === 10 &&
            (heroes as MinimapElement[]).filter((hero) => hero.team === "dire")
                .length === 5,
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
                (heroes as MinimapElement[])
                    .filter((hero) => hero.team === myTeam)
                    .map((minimapElement) => minimapElement.unitName)
            ),
            new Fact(
                topics.allEnemyHeroes,
                (heroes as MinimapElement[])
                    .filter((hero) => hero.team !== myTeam)
                    .map((minimapElement) => minimapElement.unitName)
            ),
        ],
    }),
];
