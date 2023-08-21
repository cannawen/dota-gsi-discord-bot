import Fact from "../engine/Fact";
import GsiData from "./GsiData";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule({
    label: rules.gsi.buildings,
    trigger: [topics.allData],
    // eslint-disable-next-line max-lines-per-function
    then: ([data]) => {
        const buildings = (data as GsiData).buildings;
        if (buildings?.radiant) {
            return [
                new Fact(
                    topics.t1TopHealth,
                    buildings?.radiant.dota_goodguys_tower1_top?.health
                ),
                new Fact(
                    topics.t2TopHealth,
                    buildings?.radiant.dota_goodguys_tower2_top?.health
                ),
                new Fact(
                    topics.t3TopHealth,
                    buildings?.radiant.dota_goodguys_tower3_top?.health
                ),
                new Fact(
                    topics.t4TopHealth,
                    buildings?.radiant.dota_goodguys_tower4_top?.health
                ),
                new Fact(
                    topics.t1MidHealth,
                    buildings?.radiant.dota_goodguys_tower1_mid?.health
                ),
                new Fact(
                    topics.t2MidHealth,
                    buildings?.radiant.dota_goodguys_tower2_mid?.health
                ),
                new Fact(
                    topics.t3MidHealth,
                    buildings?.radiant.dota_goodguys_tower3_mid?.health
                ),
                new Fact(
                    topics.t1BotHealth,
                    buildings?.radiant.dota_goodguys_tower1_bot?.health
                ),
                new Fact(
                    topics.t2BotHealth,
                    buildings?.radiant.dota_goodguys_tower2_bot?.health
                ),
                new Fact(
                    topics.t3BotHealth,
                    buildings?.radiant.dota_goodguys_tower3_bot?.health
                ),
                new Fact(
                    topics.t4BotHealth,
                    buildings?.radiant.dota_goodguys_tower4_bot?.health
                ),
                new Fact(
                    topics.ancientHealth,
                    buildings?.radiant.dota_goodguys_fort?.health
                ),
            ];
        } else if (buildings?.dire) {
            return [
                new Fact(
                    topics.t1TopHealth,
                    buildings?.dire.dota_badguys_tower1_top?.health
                ),
                new Fact(
                    topics.t2TopHealth,
                    buildings?.dire.dota_badguys_tower2_top?.health
                ),
                new Fact(
                    topics.t3TopHealth,
                    buildings?.dire.dota_badguys_tower3_top?.health
                ),
                new Fact(
                    topics.t4TopHealth,
                    buildings?.dire.dota_badguys_tower4_top?.health
                ),
                new Fact(
                    topics.t1MidHealth,
                    buildings?.dire.dota_badguys_tower1_mid?.health
                ),
                new Fact(
                    topics.t2MidHealth,
                    buildings?.dire.dota_badguys_tower2_mid?.health
                ),
                new Fact(
                    topics.t3MidHealth,
                    buildings?.dire.dota_badguys_tower3_mid?.health
                ),
                new Fact(
                    topics.t1BotHealth,
                    buildings?.dire.dota_badguys_tower1_bot?.health
                ),
                new Fact(
                    topics.t2BotHealth,
                    buildings?.dire.dota_badguys_tower2_bot?.health
                ),
                new Fact(
                    topics.t3BotHealth,
                    buildings?.dire.dota_badguys_tower3_bot?.health
                ),
                new Fact(
                    topics.t4BotHealth,
                    buildings?.dire.dota_badguys_tower4_bot?.health
                ),
                new Fact(
                    topics.ancientHealth,
                    buildings?.dire.dota_badguys_fort?.health
                ),
            ];
        }
    },
});
