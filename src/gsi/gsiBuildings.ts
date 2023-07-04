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
                    topics.t1Top,
                    buildings?.radiant.dota_goodguys_tower1_top.health
                ),
                new Fact(
                    topics.t2Top,
                    buildings?.radiant.dota_goodguys_tower2_top.health
                ),
                new Fact(
                    topics.t3Top,
                    buildings?.radiant.dota_goodguys_tower3_top.health
                ),
                new Fact(
                    topics.t4Top,
                    buildings?.radiant.dota_goodguys_tower4_top.health
                ),
                new Fact(
                    topics.t1Mid,
                    buildings?.radiant.dota_goodguys_tower1_mid.health
                ),
                new Fact(
                    topics.t2Mid,
                    buildings?.radiant.dota_goodguys_tower2_mid.health
                ),
                new Fact(
                    topics.t3Mid,
                    buildings?.radiant.dota_goodguys_tower3_mid.health
                ),
                new Fact(
                    topics.t1Bot,
                    buildings?.radiant.dota_goodguys_tower1_bot.health
                ),
                new Fact(
                    topics.t2Bot,
                    buildings?.radiant.dota_goodguys_tower2_bot.health
                ),
                new Fact(
                    topics.t3Bot,
                    buildings?.radiant.dota_goodguys_tower3_bot.health
                ),
                new Fact(
                    topics.t4Bot,
                    buildings?.radiant.dota_goodguys_tower4_bot.health
                ),
                new Fact(
                    topics.ancient,
                    buildings?.radiant.dota_goodguys_fort.health
                ),
            ];
        } else if (buildings?.dire) {
            return [
                new Fact(
                    topics.t1Top,
                    buildings?.dire.dota_badguys_tower1_top.health
                ),
                new Fact(
                    topics.t2Top,
                    buildings?.dire.dota_badguys_tower2_top.health
                ),
                new Fact(
                    topics.t3Top,
                    buildings?.dire.dota_badguys_tower3_top.health
                ),
                new Fact(
                    topics.t4Top,
                    buildings?.dire.dota_badguys_tower4_top.health
                ),
                new Fact(
                    topics.t1Mid,
                    buildings?.dire.dota_badguys_tower1_mid.health
                ),
                new Fact(
                    topics.t2Mid,
                    buildings?.dire.dota_badguys_tower2_mid.health
                ),
                new Fact(
                    topics.t3Mid,
                    buildings?.dire.dota_badguys_tower3_mid.health
                ),
                new Fact(
                    topics.t1Bot,
                    buildings?.dire.dota_badguys_tower1_bot.health
                ),
                new Fact(
                    topics.t2Bot,
                    buildings?.dire.dota_badguys_tower2_bot.health
                ),
                new Fact(
                    topics.t3Bot,
                    buildings?.dire.dota_badguys_tower3_bot.health
                ),
                new Fact(
                    topics.t4Bot,
                    buildings?.dire.dota_badguys_tower4_bot.health
                ),
                new Fact(
                    topics.ancient,
                    buildings?.dire.dota_badguys_fort.health
                ),
            ];
        }
    },
});
